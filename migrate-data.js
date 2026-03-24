import fs from 'fs';
import https from 'https';

const TOURS_URL = 'https://bhaktikishakti.com/data/tours.json';
const REVIEWS_URL = 'https://bhaktikishakti.com/data/reviews.json';

const TOURS_FILE = 'public/data/tours.json';
const REVIEWS_FILE = 'public/data/reviews.json';

const generateSlug = (title) => {
    if (!title) return 'tour-' + Date.now();
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const normalizeArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') return field.split('\n').filter(Boolean);
    return Object.values(field);
};

const runMigration = async () => {
    console.log('Fetching live data...');
    
    const fetchJson = (url) => new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });

    try {
        const liveTours = await fetchJson(TOURS_URL);
        const liveReviews = await fetchJson(REVIEWS_URL);

        const idMap = {}; // Maps old ID -> new Slug
        const usedSlugs = new Set();

        const getUniqueSlug = (baseSlug) => {
            let finalSlug = baseSlug;
            let counter = 2;
            while (usedSlugs.has(finalSlug)) {
                finalSlug = `${baseSlug}-${counter}`;
                counter++;
            }
            usedSlugs.add(finalSlug);
            return finalSlug;
        };

        const migratedTours = liveTours.map(tour => {
            const oldId = String(tour.id);
            const baseSlug = generateSlug(tour.title);
            const newSlug = getUniqueSlug(baseSlug);
            
            idMap[oldId] = newSlug;

            return {
                ...tour,
                id: newSlug,
                slug: newSlug, // Retain for safety, but id is now the slug
                highlights: normalizeArray(tour.highlights),
                inclusions: normalizeArray(tour.inclusions),
                exclusions: normalizeArray(tour.exclusions)
            };
        });

        const migratedReviews = liveReviews.map(review => {
            const oldId = String(review.tourId);
            return {
                ...review,
                tourId: idMap[oldId] || review.tourId // Update mapped ID or keep original if not found
            };
        });

        // Ensure directories exist
        if (!fs.existsSync('public/data')) {
            fs.mkdirSync('public/data', { recursive: true });
        }

        fs.writeFileSync(TOURS_FILE, JSON.stringify(migratedTours, null, 2));
        console.log(`Saved ${migratedTours.length} migrated tours to ${TOURS_FILE}`);

        fs.writeFileSync(REVIEWS_FILE, JSON.stringify(migratedReviews, null, 2));
        console.log(`Saved ${migratedReviews.length} migrated reviews to ${REVIEWS_FILE}`);
        
        console.log('Migration completed successfully!');
    } catch (e) {
        console.error('Migration failed:', e);
    }
};

runMigration();
