const fs = require('fs');

const slugToFind = "the-golden-triangle-express-a-4-day-journey-through-indias-royal-heart";

function findTour(filePath) {
    if (!fs.existsSync(filePath)) return null;
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const tours = JSON.parse(data);
        return tours.find(t => t.slug === slugToFind || t.id === slugToFind);
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e.message);
        return null;
    }
}

const paths = [
    'c:\\xampp\\htdocs\\bharat_darshan\\tours.json',
    'c:\\xampp\\htdocs\\bharat_darshan\\src\\data\\tours.json',
    'c:\\xampp\\htdocs\\bharat_darshan\\public\\data\\tours.json'
];

for (const p of paths) {
    console.log(`Checking ${p}...`);
    const tour = findTour(p);
    if (tour) {
        console.log(`FOUND in ${p}:`);
        console.log(JSON.stringify({
            title: tour.title,
            slug: tour.slug,
            image: tour.image ? "PRESENT" : "MISSING",
            imagesCount: tour.images ? tour.images.length : 0,
            itineraryDays: tour.itinerary ? tour.itinerary.length : 0,
            itineraryHasImages: tour.itinerary ? tour.itinerary.some(d => d.image || d.images) : false
        }, null, 2));
        process.exit(0);
    }
}

console.log("Tour NOT FOUND in any local file.");
