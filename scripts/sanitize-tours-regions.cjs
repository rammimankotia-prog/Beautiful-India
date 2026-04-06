/**
 * sanitize-tours-regions.cjs
 * 
 * One-shot data sanitization script.
 * Run on production server with:  node scripts/sanitize-tours-regions.cjs
 * 
 * Fixes:
 *  1. Concatenated values like "KashmirJammu and Kashmir" → ["Jammu and Kashmir"]
 *  2. Legacy "Kashmir", "Jammu & Kashmir" → "Jammu and Kashmir"
 *  3. Duplicate entries in the stateRegion array (e.g. ["Jammu and Kashmir", "Jammu and Kashmir"])
 *  4. Duplicate entries in the stateRegion across separate tours causing
 *     3× "Jammu and Kashmir" or 2× "Delhi" in the dropdown — these are NOT
 *     duplicates; they are correctly separate tours. Only intra-tour array
 *     duplicates are fixed here.
 */

const fs = require('fs');
const path = require('path');

// ─── Known canonical state names ────────────────────────────────────────────
const KNOWN_STATES = [
    'Jammu and Kashmir', 'Himachal Pradesh', 'Uttarakhand', 'Rajasthan',
    'Kerala', 'Goa', 'Ladakh', 'Andaman Islands', 'Delhi', 'Mumbai',
    'Kolkata', 'Chennai', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu',
    'Maharashtra', 'Gujarat', 'West Bengal', 'Madhya Pradesh', 'Sikkim',
    'Assam', 'Meghalaya', 'Arunachal Pradesh', 'Maldives', 'Thailand',
    'Bali', 'Dubai', 'Singapore', 'Sri Lanka', 'Nepal', 'Bhutan',
];

// ─── Normalization helpers ───────────────────────────────────────────────────
const normalizeBucket = (s) => {
    const val = String(s || '').toLowerCase().trim();
    if (
        val === 'kashmir' ||
        val === 'jammu' ||
        val === 'jammu and kashmir' ||
        val === 'jammu & kashmir' ||
        (val.includes('kashmir') && val.includes('jammu'))
    ) return 'jammu and kashmir';
    return val;
};

const canonicalDisplay = (bucket) => {
    if (bucket === 'jammu and kashmir') return 'Jammu and Kashmir';
    // Find the matching known state (case-insensitive)
    const match = KNOWN_STATES.find(k => k.toLowerCase() === bucket);
    return match || null; // null means unknown state, leave as-is
};

// Splits a concatenated string like "KashmirJammu and Kashmir" into parts
const splitConcatenated = (raw) => {
    const s = String(raw || '').trim();
    if (!s) return [];

    // Exact match → return immediately
    if (KNOWN_STATES.some(k => k.toLowerCase() === s.toLowerCase())) return [s];

    // Check if a known state appears at the START (greedy longest match first)
    const sortedByLength = [...KNOWN_STATES].sort((a, b) => b.length - a.length);
    for (const state of sortedByLength) {
        if (s.toLowerCase().startsWith(state.toLowerCase()) && s.length > state.length) {
            const rest = s.slice(state.length).trim();
            return [state, ...splitConcatenated(rest)];
        }
    }
    // Check if a known state appears at the END
    for (const state of sortedByLength) {
        if (s.toLowerCase().endsWith(state.toLowerCase()) && s.length > state.length) {
            const start = s.slice(0, s.length - state.length).trim();
            return [...splitConcatenated(start), state];
        }
    }

    return [s]; // Unknown — return as-is
};

// Full normalization of a raw stateRegion value (string or array)
const normalizeRegion = (raw) => {
    const items = Array.isArray(raw) ? raw : (raw ? [raw] : []);
    const seen = new Set();
    const result = [];

    items.forEach(item => {
        const parts = splitConcatenated(item);
        parts.forEach(part => {
            const bucket = normalizeBucket(part);
            if (!bucket) return;
            if (seen.has(bucket)) return;
            seen.add(bucket);
            const display = canonicalDisplay(bucket) || String(part).trim();
            result.push(display);
        });
    });

    return result;
};

// ─── Process a tours.json file ───────────────────────────────────────────────
const sanitizeFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.log(`  SKIP (not found): ${filePath}`);
        return;
    }

    let tours;
    try {
        tours = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`  ERROR reading ${filePath}:`, e.message);
        return;
    }

    if (!Array.isArray(tours)) {
        console.log(`  SKIP (not an array): ${filePath}`);
        return;
    }

    let changeCount = 0;

    const sanitized = tours.map((tour, idx) => {
        if (!tour) return tour;

        const original = JSON.stringify(tour.stateRegion);
        const normalized = normalizeRegion(tour.stateRegion);
        const after = JSON.stringify(normalized);

        if (original !== after) {
            changeCount++;
            console.log(`  Tour [${idx}] "${tour.slug || tour.id}" stateRegion:`);
            console.log(`    BEFORE: ${original}`);
            console.log(`    AFTER:  ${after}`);
        }

        return { ...tour, stateRegion: normalized };
    });

    if (changeCount === 0) {
        console.log(`  ✓ No changes needed in ${filePath}`);
        return;
    }

    // Create a backup before overwriting
    const backupPath = filePath + '.bak-' + Date.now();
    fs.copyFileSync(filePath, backupPath);
    console.log(`  Backup saved to: ${backupPath}`);

    fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2), 'utf8');
    console.log(`  ✓ Saved ${changeCount} fix(es) to: ${filePath}`);
};

// ─── Run ─────────────────────────────────────────────────────────────────────
console.log('=== Tours Region Sanitization Script ===\n');

const root = path.join(__dirname, '..');
const targets = [
    path.join(root, 'src', 'data', 'tours.json'),
    path.join(root, 'public', 'data', 'tours.json'),
];

targets.forEach(f => {
    console.log(`Processing: ${f}`);
    sanitizeFile(f);
    console.log('');
});

console.log('=== Done ===');
