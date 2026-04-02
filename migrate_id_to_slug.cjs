const fs = require('fs');
const path = require('path');

const tourDataPath = path.join(__dirname, 'public', 'data', 'tours.json');
const backupPath = path.join(__dirname, 'public', 'data', 'tours_backup.json');

const slugify = (text) => {
  return (text || 'untitled-tour')
    .toLowerCase()
    .replace(/[^\u0000-\u007E]/g, '')  // Strip non-ASCII
    .replace(/[^a-z0-9\s-]/g, '')      // Remove special chars
    .replace(/\s+/g, '-')              // Spaces to hyphens
    .replace(/-+/g, '-')               // Collapse many hyphens
    .replace(/^-|-$/g, '')             // Trim hyphens
    || 'untitled-tour';
};

try {
  if (fs.existsSync(tourDataPath)) {
    console.log('Backing up tours.json...');
    fs.copyFileSync(tourDataPath, backupPath);
  } else {
    console.error('tours.json not found!'); process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(tourDataPath, 'utf8'));
  console.log(`Processing ${data.length} tours...`);

  let changeCount = 0;
  const updatedData = data.map(tour => {
    const oldId = tour.id;
    const oldSlug = tour.slug;
    
    // If slug is numeric, null, or empty, generate a real one from title
    const isNumeric = (str) => /^\d+$/.test(String(str));
    
    if (!tour.slug || isNumeric(tour.slug)) {
      tour.slug = slugify(tour.title);
    }
    
    // Set id as slug
    tour.id = tour.slug;
    
    if (tour.id !== oldId || tour.slug !== oldSlug) {
      changeCount++;
    }
    return tour;
  });

  fs.writeFileSync(tourDataPath, JSON.stringify(updatedData, null, 2), 'utf8');
  console.log(`Migration successful! Updated ${changeCount} tours.`);

} catch (err) {
  console.error('Migration failed:', err.message);
  process.exit(1);
}
