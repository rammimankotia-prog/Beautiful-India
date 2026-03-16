import json
import os

file_path = r'c:\xampp\htdocs\bharat_darshan\src\data\tours.json'

with open(file_path, 'r', encoding='utf-8') as f:
    tours = json.load(f)

# Sample tours to add
new_tours = [
    {
        "id": "3",
        "title": "Golden Triangle Train Tour",
        "description": "Explore Delhi, Agra, and Jaipur by the luxurious Gatimaan Express and Shatabdi.",
        "destination": "Asia",
        "stateRegion": "North India",
        "duration": "5 days",
        "price": 35000,
        "priceBasis": "per_package",
        "minPersons": 2,
        "status": "active",
        "order": 3,
        "theme": "culture",
        "nature": "group",
        "style": "comfort",
        "priceCategory": "medium",
        "transport": "train",
        "image": "https://images.unsplash.com/photo-1594993872144-8422368a7359?auto=format&fit=crop&q=80&w=800",
        "inclusions": "Train tickets (CC/EC)\nHotel stay\nBreakfast\nSightseeing by AC cab",
        "exclusions": "Lunch & Dinner\nEntry fees\nTips",
        "highlights": "Fastest train travel\nHeritage sites\nLuxury experience",
        "isFeatured": True,
        "itinerary": [
            {"day": 1, "title": "Delhi Arrival", "description": "Pickup and local sightseeing in Delhi."},
            {"day": 2, "title": "Delhi to Agra by Gatimaan Express", "description": "Morning train to Agra, visit Taj Mahal."},
            {"day": 3, "title": "Agra to Jaipur", "description": "Drive to Jaipur via Fatehpur Sikri."},
            {"day": 4, "title": "Jaipur Sightseeing", "description": "Visit Amer Fort, Hawa Mahal."},
            {"day": 5, "title": "Jaipur to Delhi by Shatabdi", "description": "Evening train back to Delhi."}
        ],
        "faq": [],
        "images": [{"url": "https://images.unsplash.com/photo-1594993872144-8422368a7359?auto=format&fit=crop&q=80&w=800"}]
    },
    {
        "id": "4",
        "title": "South India Temple Run by Train",
        "description": "A spiritual journey through Tamil Nadu and Karnataka via Indian Railways.",
        "destination": "Asia",
        "stateRegion": "South India",
        "duration": "8 days",
        "price": 45000,
        "priceBasis": "per_package",
        "minPersons": 2,
        "status": "active",
        "order": 4,
        "theme": "spiritual",
        "nature": "private",
        "style": "standard",
        "priceCategory": "medium",
        "transport": "train",
        "image": "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800",
        "inclusions": "Train tickets\nAccommodation\nAll transfers\nGuided tours",
        "exclusions": "Meals\nPersonal expenses",
        "highlights": "Grand temples\nScenic rail routes",
        "isFeatured": False,
        "itinerary": [
            {"day": 1, "title": "Chennai Arrival", "description": "Arrival and hotel check-in."},
            {"day": 2, "title": "Chennai to Madurai", "description": "Morning train to Madurai."},
            {"day": 3, "title": "Madurai to Rameshwaram", "description": "Train journey across Pamban bridge."},
            {"day": 4, "title": "Rameshwaram exploration", "description": "Temple visit and beach time."},
            {"day": 5, "title": "Rameshwaram to Kanyakumari", "description": "Evening train to the southern tip."}
        ],
        "faq": [],
        "images": [{"url": "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800"}]
    }
]

tours.extend(new_tours)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(tours, f, indent=2)

print("Added 2 more train tours.")
