const fs = require('fs');

const slugToFind = "golden-triangle-tour";

function extractTour(filePath) {
    if (!fs.existsSync(filePath)) return;
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const tours = JSON.parse(data);
        const tour = tours.find(t => t.slug === slugToFind);
        if (tour) {
            // Remove large image strings for better readability
            const cleanedTour = JSON.parse(JSON.stringify(tour));
            if (cleanedTour.image) cleanedTour.image = cleanedTour.image.substring(0, 50) + "...";
            if (cleanedTour.images) {
                cleanedTour.images = cleanedTour.images.map(img => ({
                    ...img,
                    url: img.url.substring(0, 50) + "..."
                }));
            }
            if (cleanedTour.itinerary) {
                cleanedTour.itinerary = cleanedTour.itinerary.map(day => ({
                    ...day,
                    image: day.image ? day.image.substring(0, 50) + "..." : undefined
                }));
            }
            console.log(`TOUR DATA from ${filePath}:`);
            console.log(JSON.stringify(cleanedTour, null, 2));
        }
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e.message);
    }
}

const paths = [
    'c:\\xampp\\htdocs\\bharat_darshan\\tours.json',
    'c:\\xampp\\htdocs\\bharat_darshan\\src\\data\\tours.json'
];

paths.forEach(extractTour);
