import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import model using absolute path
import BikeTour from '../src/models/BikeTour.js';

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bharat_darshan_db');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const addTour = async () => {
    await connectDB();

    const tourData = {
        title: "Ladakh Bike Expedition",
        slug: "ladakh-bike-expedition",
        subtitle: "Conquer the highest motorable roads in the world.",
        duration: "10 Days / 9 Nights",
        coveredPlaces: ["Leh", "Nubra Valley", "Pangong Tso", "Magnetic Hill", "Khardung La"],
        destination: "Ladakh",
        country: "India",
        tourType: "Bike", // Motorbike Tour
        difficulty: "Challenging",
        equipment: ["Helmet", "Water", "Repair Kit", "First Aid"],
        pricing: {
            perPerson: 38000,
            perCouple: 72000,
            perGroup: {
                price: 180000,
                minPersons: 6
            }
        },
        mainImage: "/images/tours/ladakh-bike-hero.png",
        images: [
            "/images/tours/ladakh-bike-hero.png",
            "/images/tours/pangong-lake.png",
            "/images/tours/nubra-valley.png",
            "/images/tours/khardung-la.png"
        ],
        content: `
            <article class="article-content">
                <p class="lead">Experience the ultimate thrill of motorcycling in the "Land of High Passes". This 10-day expedition takes you through some of the most dramatic landscapes on Earth, from the moon-like terrain of the Indus Valley to the crystal-blue heights of Pangong Lake.</p>
                
                <h2>Adventure Highlights</h2>
                <ul>
                    <li>Ride across <strong>Khardung La</strong>, one of the highest motorable passes in the world at 17,582 ft.</li>
                    <li>Witness the surreal beauty of <strong>Pangong Tso</strong>, a high-altitude lake that changes colors with the sun.</li>
                    <li>Explore the desert landscapes of <strong>Nubra Valley</strong> and ride on double-humped Bactrian camels.</li>
                    <li>Experience the gravity-defying phenomena at <strong>Magnetic Hill</strong>.</li>
                    <li>Visit ancient monasteries perched on rocky cliffs, including Thiksey and Hemis.</li>
                </ul>

                <h2>Provisional Itinerary</h2>
                <h3>Day 1-2: Arrival and Acclimatization in Leh</h3>
                <p>Transfer to the hotel and rest to adjust to the high altitude. Spend the second day visiting local sights like Leh Palace and Shanti Stupa while getting familiar with your Royal Enfield motorcycle.</p>
                
                <h3>Day 3-4: Leh to Nubra Valley via Khardung La</h3>
                <p>A challenging ascent to the world-famous Khardung La Pass followed by a descent into the lush Nubra Valley. Overnight in deluxe camps under the stars.</p>
                
                <h3>Day 5-6: Nubra to Pangong Tso</h3>
                <p>Take the direct Shyok River route to the mesmerizing Pangong Lake. The view of the lake as you emerge from the mountains is a life-changing experience.</p>
                
                <h3>Day 7-10: Returning to Leh and Departure</h3>
                <p>Return to Leh via Chang La Pass. Final shopping at the local bazaar and departure with memories of a lifetime.</p>
            </article>
        `,
        schemaMarkup: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Tour",
            "name": "Ladakh Bike Expedition",
            "description": "A thrilling 10-day motorcycling adventure through Leh and Ladakh.",
            "duration": "P10D",
            "offers": {
                "@type": "Offer",
                "price": "38000",
                "priceCurrency": "INR"
            }
        }),
        showInMenu: true,
        status: "active",
        featured: true,
        highlights: [
            "World's Highest Passes",
            "Remote Himalayan Villages",
            "Pangong Tso Night Camping",
            "Royal Enfield Experience"
        ],
        whatsIncluded: [
            "Royal Enfield Himalayan 411cc",
            "Fuel for the entire trip",
            "Professional Mechanics & Backup Van",
            "Accommodation in Hotels/Deluxe Tents",
            "Breakfast & Dinner Daily",
            "Inner Line Permits"
        ]
    };

    try {
        // Check if exists
        const existing = await BikeTour.findOne({ slug: tourData.slug });
        if (existing) {
            console.log("Tour already exists, updating...");
            await BikeTour.findByIdAndUpdate(existing._id, tourData);
        } else {
            const newTour = new BikeTour(tourData);
            await newTour.save();
            console.log("Ladakh Bike Expedition added successfully!");
        }
        mongoose.connection.close();
    } catch (error) {
        console.error("Error adding tour:", error);
        mongoose.connection.close();
    }
};

addTour();
