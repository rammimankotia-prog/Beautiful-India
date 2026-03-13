/**
 * fix-duplicate-exports.cjs
 * Scans all .jsx files in src/pages and removes duplicate `export default` lines.
 */
const fs = require('fs');
const path = require('path');

const PAGE_DIR = path.resolve(__dirname, 'src', 'pages');
const files = fs.readdirSync(PAGE_DIR).filter(f => f.endsWith('.jsx'));

let fixedCount = 0;
const fixedFiles = [];

for (const file of files) {
    const filePath = path.join(PAGE_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Find all lines with 'export default'
    const exportDefaultLines = lines.reduce((acc, line, idx) => {
        if (/^\s*export\s+default\s+/.test(line)) acc.push(idx);
        return acc;
    }, []);

    if (exportDefaultLines.length > 1) {
        // Keep only the LAST export default, remove all others
        const keepLine = exportDefaultLines[exportDefaultLines.length - 1];
        const toRemove = new Set(exportDefaultLines.slice(0, -1));

        const newLines = lines.filter((_, idx) => !toRemove.has(idx));
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
        fixedCount++;
        fixedFiles.push(`${file} (had ${exportDefaultLines.length} exports, kept line ${keepLine + 1})`);
        console.log(`✓ Fixed: ${file}`);
    }
}

console.log(`\nDone. Fixed ${fixedCount} file(s).`);
if (fixedFiles.length) {
    console.log('Files fixed:');
    fixedFiles.forEach(f => console.log('  -', f));
} else {
    console.log('No files needed fixing.');
}
