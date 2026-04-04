const fs = require('fs');
const path = require('path');

const toursPath = path.join(__dirname, '../src/data/tours.json');

const normalizeBucket = (val) => {
  if (!val) return "";
  const v = val.toLowerCase().trim();
  if (v === "kashmir" || v === "jammu and kashmir" || v === "jammu & kashmir") {
    return "jammu and kashmir";
  }
  return v;
};

const displayState = (val) => {
  const normalized = normalizeBucket(val);
  if (normalized === "jammu and kashmir") return "Jammu and Kashmir";
  if (!val) return "";
  return val.charAt(0).toUpperCase() + val.slice(1);
};

try {
  const data = JSON.parse(fs.readFileSync(toursPath, 'utf8'));
  let fixedCount = 0;

  const newData = data.map(tour => {
    let regions = Array.isArray(tour.stateRegion) ? tour.stateRegion : [tour.stateRegion];
    
    // Normalize and deduplicate
    const normalizedRegions = [...new Set(regions.map(r => displayState(r)).filter(Boolean))];
    
    // Check if changed
    const hasChanged = JSON.stringify(regions) !== JSON.stringify(normalizedRegions);
    if (hasChanged) {
      fixedCount++;
      return { ...tour, stateRegion: normalizedRegions };
    }
    return tour;
  });

  if (fixedCount > 0) {
    fs.writeFileSync(toursPath, JSON.stringify(newData, null, 4), 'utf8');
    console.log(`Successfully normalized ${fixedCount} tours.`);
  } else {
    console.log("No normalization needed for tours.");
  }

} catch (err) {
  console.error("Error processing tours.json:", err);
  process.exit(1);
}
