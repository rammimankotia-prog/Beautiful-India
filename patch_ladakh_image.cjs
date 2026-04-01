const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'public', 'data', 'tours.json'),
  path.join(__dirname, 'src', 'data', 'tours.json')
];

const targetUrl = 'https://images.unsplash.com/photo-1581793745862-99f6606fec28?auto=format&fit=crop&q=80&w=800';
const replacementPath = '/ladakh-bike-expedition.png';

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`Patching ${file}...`);
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(targetUrl)) {
      content = content.replace(targetUrl, replacementPath);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Successfully patched ${file}`);
    } else {
      console.log(`Target URL not found in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
