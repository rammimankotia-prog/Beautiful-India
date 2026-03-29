const mongoose = require('mongoose');
const BikeTour = require('../src/models/BikeTour');
require('dotenv').config();

const MONGO_URI = "mongodb://127.0.0.1:27017/bharat_darshan";

const southIndiaTours = [
  {
    title: "South India Coastal Trail: The Spice Coast Odyssey",
    slug: "south-india-coastal-trail-cycling",
    destination: "Kerala & Tamil Nadu",
    country: "India",
    duration: "10 Days / 9 Nights",
    difficulty: "Moderate",
    tourType: "Bicycle",
    mainImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80"
    ],
    highlights: [
      "Cycle through the emerald backwaters of Alleppey",
      "Sunset at Kanyakumari, the southernmost tip of India",
      "Explore the colonial charm of Kochi's Fort area",
      "Traditional Kathakali performance & Ayurvedic wellness"
    ],
    content: `
      <h2>The Ultimate Tropical Expedition</h2>
      <p>Embark on a journey that captures the very soul of South India. This 10-day cycling odyssey takes you from the historic port of Kochi down to the mystical confluence of three oceans at Kanyakumari.</p>
      
      <blockquote>"A route where the scent of cardamom follows you, and the salt of the Arabian Sea guides your path."</blockquote>
      
      <h3>Backwater Serenity</h3>
      <p>Our journey begins in the lush palm-fringed trails of Alleppey. Pedal alongside tranquil canals where life moves at the pace of a slow-drifting houseboat. This isn't just a ride; it's an immersion into a landscape that has inspired poets for centuries.</p>
      
      <h3>The Highs of Munnar</h3>
      <p>We climb into the undulating tea gardens of the Western Ghats. The morning mist over the estates provides a surreal backdrop as we navigate the winding roads of Munnar, stopping only for the world's freshest brew.</p>
    `,
    pricing: {
      perPerson: 85000,
      currency: "INR"
    },
    whatsIncluded: ["Premium Hybrid Bicycle", "Boutique Heritage Stays", "Support Vehicle", "All Meals", "Local Expert Guide"],
    equipment: ["Giant/Trek Hybrid Bike", "Safety Helmet", "Repair Kit", "Energy Snacks"],
    coveredPlaces: ["Kochi", "Alleppey", "Munnar", "Varkala", "Kanyakumari"],
    status: "Active"
  },
  {
    title: "Southern Spice Run: Motorbike Coastal Challenge",
    slug: "southern-spice-run-motorbike",
    destination: "Kerala & Tamil Nadu",
    country: "India",
    duration: "8 Days / 7 Nights",
    difficulty: "Moderate",
    tourType: "Bike",
    mainImage: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80"
    ],
    highlights: [
      "Thumping through the hair-pin bends of Munnar",
      "Coastal highway cruise along the Arabian Sea",
      "Explore the hidden beaches of Marari",
      "Cultural luxury at Fort Kochi"
    ],
    content: `
      <h2>The Thump of the Tropics</h2>
      <p>Experience the thrill of riding the legendary Royal Enfield through the diverse terrains of the South. From cliffside coastal roads to the misty peaks of the Ghats, this is a masterclass in adventure riding.</p>
      
      <h3>Coastal Cruising</h3>
       <p>Feel the sea breeze as we open the throttle on the NH66. The stretch from Varkala to Kanyakumari is legendary among riders, offering panoramic views of the ocean on one side and green hills on the other.</p>
    `,
    pricing: {
      perPerson: 95000,
      currency: "INR"
    },
    whatsIncluded: ["Royal Enfield Himalayan", "Fuel & Maintenance", "Lead Rider & Mechanic", "Heritage Stays", "All Meals"],
    equipment: ["RE Himalayan 411/450", "Riding Jacket (Rental)", "Panniers", "Back-up Vehicle"],
    coveredPlaces: ["Kochi", "Marari", "Varkala", "Munnar", "Kanyakumari"],
    status: "Active"
  }
];

async function seedTours() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    for (const tour of southIndiaTours) {
      const existing = await BikeTour.findOne({ slug: tour.slug });
      if (existing) {
        await BikeTour.updateOne({ slug: tour.slug }, tour);
        console.log(`Updated: ${tour.title}`);
      } else {
        await new BikeTour(tour).save();
        console.log(`Created: ${tour.title}`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedTours();
