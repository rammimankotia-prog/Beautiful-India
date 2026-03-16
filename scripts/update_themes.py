import json

file_path = r'c:\xampp\htdocs\bharat_darshan\src\data\tours.json'

with open(file_path, 'r', encoding='utf-8') as f:
    tours = json.load(f)

for tour in tours:
    if tour['id'] == '3': # Golden Triangle
        tour['theme'] = 'cultural'
    if tour['id'] == '4': # South India
        tour['theme'] = 'spiritual'

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(tours, f, indent=2)

print("Updated themes for tours 3 and 4.")
