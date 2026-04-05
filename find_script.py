
import json
import os

filepath = r'c:\xampp\htdocs\bharat_darshan\src\data\guides.json'

try:
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for item in data:
        print(f"Checking ID: {item.get('id')} - Title: {item.get('title')}")
        content = item.get('content', '')
        if '<script' in content:
            print(f"FOUND SCRIPT IN CONTENT OF ID {item.get('id')}")
            # Find the script tag
            start = content.find('<script')
            end = content.find('</script>') + 9
            script_block = content[start:end]
            print("--- SCRIPT BLOCK START ---")
            print(script_block)
            print("--- SCRIPT BLOCK END ---")
        else:
            print("No script found in content.")
            
except Exception as e:
    print(f"Error: {e}")
