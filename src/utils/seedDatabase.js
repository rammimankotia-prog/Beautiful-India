import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import Tour from '../models/Tour.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
await connectDB();

const importData = async () => {
    try {
        // Clear all existing tours to avoid duplicates while testing
        await Tour.deleteMany();
        console.log('Cleared existing tours from database.');

        // Read local JSON
        const toursJSON = fs.readFileSync(path.join(__dirname, '../data/tours.json'), 'utf8');
        const tours = JSON.parse(toursJSON);

        // Map generic tours to default model format
        const formattedTours = tours.map(t => ({
            ...t,
            homePagePlacements: t.isFeatured ? ['Popular Destinations', 'Recommended Tour Packages'] : ['None'],
            status: t.status || 'active'
        }));

        await Tour.insertMany(formattedTours);
        console.log(`Successfully seeded ${formattedTours.length} tours into MongoDB!`);
        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

importData();
