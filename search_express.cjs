const fs = require('fs');

const searchTerm = "Express".toLowerCase();

function searchInJSON(filePath) {
    if (!fs.existsSync(filePath)) return;
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const tours = JSON.parse(data);
        const matches = tours.filter(t => {
            const stringified = JSON.stringify(t).toLowerCase();
            return stringified.includes(searchTerm);
        });
        
        if (matches.length > 0) {
            console.log(`FOUND ${matches.length} matches in ${filePath}:`);
            matches.forEach(m => {
                console.log(`- Title: ${m.title}`);
                console.log(`  Slug: ${m.slug}`);
                console.log(`  ID: ${m.id}`);
            });
        }
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e.message);
    }
}

const paths = [
    'c:\\xampp\\htdocs\\bharat_darshan\\tours.json',
    'c:\\xampp\\htdocs\\bharat_darshan\\src\\data\\tours.json'
];

paths.forEach(searchInJSON);
