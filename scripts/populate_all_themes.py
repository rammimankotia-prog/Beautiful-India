import json
import os

file_path = r'c:\xampp\htdocs\bharat_darshan\src\data\tours.json'
public_path = r'c:\xampp\htdocs\bharat_darshan\public\data\tours.json'

with open(file_path, 'r', encoding='utf-8') as f:
    tours = json.load(f)

# Keep the first 4 tours
tours = tours[:4]

# New tours to cover missing themes
new_tours = [
    {
        "id": "5",
        "title": "Romantic Maldives Escape",
        "description": "Experience the ultimate romantic getaway with crystal clear waters and overwater villas.",
        "destination": "International",
        "stateRegion": "Maldives",
        "duration": "6 days",
        "price": 120000,
        "priceBasis": "per_package",
        "minPersons": 2,
        "status": "active",
        "order": 5,
        "theme": "honeymoon",
        "nature": "honeymoon",
        "style": "luxury",
        "priceCategory": "high",
        "transport": "flight",
        "image": "https://images.unsplash.com/photo-1514282401047-d79b71a640f5?auto=format&fit=crop&q=80&w=800",
        "inclusions": "Flights\nWater Villa\nMeals\nTransfers",
        "exclusions": "Personal expenses",
        "highlights": "Overwater Villa\nCandlelight Dinner",
        "isFeatured": True,
        "itinerary": [
            {"day": 1, "title": "Arrival", "description": "Arrive in Male and transfer to resort."}
        ],
        "faq": [],
        "images": [{"url": "https://images.unsplash.com/photo-1514282401047-d79b71a640f5?auto=format&fit=crop&q=80&w=800"}]
    },
    {
        "id": "6",
        "title": "Goa Family Vacation",
        "description": "A fun-filled family holiday exploring the beaches, forts, and culture of Goa.",
        "destination": "India",
        "stateRegion": "Goa",
        "duration": "5 days",
        "price": 45000,
        "priceBasis": "per_package",
        "minPersons": 4,
        "status": "active",
        "order": 6,
        "theme": "family",
        "nature": "group",
        "style": "comfort",
        "priceCategory": "medium",
        "transport": "mixed",
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800",
        "inclusions": "Hotel\nBreakfast\nSightseeing",
        "exclusions": "Flights\nOther meals",
        "highlights": "Beach activities\nFort Aguada",
        "isFeatured": False,
        "itinerary": [
            {"day": 1, "title": "Arrival", "description": "Check-in and relax at the beach."}
        ],
        "faq": [],
        "images": [{"url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800"}]
    },
    {
        "id": "7",
        "title": "Ladakh Bike Expedition",
        "description": "A thrilling biking adventure through the rugged terrains of Leh and Ladakh.",
        "destination": "India",
        "stateRegion": "Ladakh",
        "duration": "10 days",
        "price": 38000,
        "priceBasis": "per_person",
        "minPersons": 1,
        "status": "active",
        "order": 7,
        "theme": "adventure",
        "nature": "solo",
        "style": "standard",
        "priceCategory": "medium",
        "transport": "mixed",
        "image": "https://images.unsplash.com/photo-1581793745862-99f6606fec28?auto=format&fit=crop&q=80&w=800",
        "inclusions": "Bike Rental\nAccommodation\nMeals",
        "exclusions": "Fuel\nFlights",
        "highlights": "Khardung La\nPangong Lake",
        "isFeatured": True,
        "itinerary": [
            {"day": 1, "title": "Leh Arrival", "description": "Acclimatization."}
        ],
        "faq": [],
        "images": [{"url": "https://images.unsplash.com/photo-1581793745862-99f6606fec28?auto=format&fit=crop&q=80&w=800"}]
    },
    {
        "id": "8",
        "title": "Ranthambore Jungle Safari",
        "description": "Encounter majestic Bengal tigers and diverse wildlife in Ranthambore.",
        "destination": "India",
        "stateRegion": "Rajasthan",
        "duration": "3 days",
        "price": 28000,
        "priceBasis": "per_package",
        "minPersons": 2,
        "status": "active",
        "order": 8,
        "theme": "wildlife",
        "nature": "private",
        "style": "comfort",
        "priceCategory": "medium",
        "transport": "mixed",
        "image": "https://images.unsplash.com/photo-1534152912693-41bb3805f7ee?auto=format&fit=crop&q=80&w=800",
        "inclusions": "Safari permits\nResort stay\nMeals",
        "exclusions": "Camera fees\nTransport to Ranthambore",
        "highlights": "Tiger tracking\nFort visit",
        "isFeatured": False,
        "itinerary": [
            {"day": 1, "title": "Arrival", "description": "Check-in to resort, afternoon safari."}
        ],
        "faq": [],
        "images": [{"url": "https://images.unsplash.com/photo-1534152912693-41bb3805f7ee?auto=format&fit=crop&q=80&w=800"}]
    },
    {
        "id": "9",
        "title": "Varanasi Photography Tour",
        "description": "Capture the soul of India along the sacred ghats of the Ganges.",
        "destination": "India",
        "stateRegion": "Uttar Pradesh",
        "duration": "4 days",
        "price": 22000,
        "priceBasis": "per_person",
        "minPersons": 1,
        "status": "active",
        "order": 9,
        "theme": "photography",
        "nature": "solo",
        "style": "budget",
        "priceCategory": "low",
        "transport": "mixed",
        "image": "https://images.unsplash.com/photo-1561361513-3335b11a43a1?auto=format&fit=crop&q=80&w=800",
        "inclusions": "Guesthouse\nGuide\nBoat rides",
        "exclusions": "Meals\nCamera gear",
        "highlights": "Ganga Aarti\nMorning boat ride",
        "isFeatured": False,
        "itinerary": [
            {"day": 1, "title": "Arrival", "description": "Settle in and evening Aarti photography."}
        ],
        "faq": [],
        "images": [{"url": "https://images.unsplash.com/photo-1561361513-3335b11a43a1?auto=format&fit=crop&q=80&w=800"}]
    },
    {
        "id": "10",
        "title": "Andaman Beach Retreat",
        "description": "A relaxing escape to the pristine beaches and cerulean waters of the Andaman Islands.",
        "destination": "India",
        "stateRegion": "Andaman Islands",
        "duration": "6 days",
        "price": 55000,
        "priceBasis": "per_package",
        "minPersons": 2,
        "status": "active",
        "order": 10,
        "theme": "beach",
        "nature": "group",
        "style": "comfort",
        "priceCategory": "medium",
        "transport": "flight",
        "image": "https://images.unsplash.com/photo-1589136777351-fdc9c9cb15f9?auto=format&fit=crop&q=80&w=800",
        "inclusions": "Hotels\nFerry transfers\nBreakfast",
        "exclusions": "Flights\nOther meals",
        "highlights": "Radhanagar Beach\nScuba Diving",
        "isFeatured": True,
        "itinerary": [
            {"day": 1, "title": "Port Blair Arrival", "description": "Cellular Jail visit and Light & Sound show."}
        ],
        "faq": [],
        "images": [{"url": "https://images.unsplash.com/photo-1589136777351-fdc9c9cb15f9?auto=format&fit=crop&q=80&w=800"}]
    },
    {
        "id": "11",
        "title": "Rajasthan Heritage Tour",
        "description": "Immerse yourself in the rich culture, grand forts, and royal history of Rajasthan.",
        "destination": "India",
        "stateRegion": "Rajasthan",
        "duration": "8 days",
        "price": 75000,
        "priceBasis": "per_package",
        "minPersons": 2,
        "status": "active",
        "order": 11,
        "theme": "cultural",
        "nature": "private",
        "style": "luxury",
        "priceCategory": "high",
        "transport": "mixed",
        "image": "https://images.unsplash.com/photo-1599661559886-9dc4626156e7?auto=format&fit=crop&q=80&w=800",
        "inclusions": "Heritage Hotels\nPrivate Car\nBreakfast",
        "exclusions": "Entry fees\nTips",
        "highlights": "Amer Fort\nCity Palace\nDesert Safari",
        "isFeatured": False,
        "itinerary": [
            {"day": 1, "title": "Jaipur Arrival", "description": "Check-in and local market visit."}
        ],
        "faq": [],
        "images": [{"url": "https://images.unsplash.com/photo-1599661559886-9dc4626156e7?auto=format&fit=crop&q=80&w=800"}]
    },
    {
        "id": "12",
        "title": "Himalayan Trekking Expedition",
        "description": "Conquer the trails of Himachal Pradesh with this guided trekking experience.",
        "destination": "India",
        "stateRegion": "Himachal Pradesh",
        "duration": "7 days",
        "price": 25000,
        "priceBasis": "per_person",
        "minPersons": 1,
        "status": "active",
        "order": 12,
        "theme": "trekking",
        "nature": "group",
        "style": "budget",
        "priceCategory": "low",
        "transport": "mixed",
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
        "inclusions": "Tents\nMeals on trek\nGuides",
        "exclusions": "Backpacks\nTransport to base camp",
        "highlights": "Alpine meadows\nCamping under stars",
        "isFeatured": False,
        "itinerary": [
            {"day": 1, "title": "Manali Arrival", "description": "Meet team, gear check."}
        ],
        "faq": [],
        "images": [{"url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"}]
    }
]

tours.extend(new_tours)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(tours, f, indent=2)

with open(public_path, 'w', encoding='utf-8') as f:
    json.dump(tours, f, indent=2)

print(f"Added {len(new_tours)} tours to cover all themes. Total tours: {len(tours)}")
