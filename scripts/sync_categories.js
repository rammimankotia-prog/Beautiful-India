import fs from 'fs';
import path from 'path';

const srcCategoriesPath = path.resolve('src/data/categories.json');
const publicCategoriesPath = path.resolve('public/data/categories.json');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide the JSON string of updated categories as an argument.");
  process.exit(1);
}

try {
  const updatedCategoriesStr = args[0];
  const updatedCategories = JSON.parse(updatedCategoriesStr);

  // Default meta and presets to keep the structure intact
  const currentCategoriesData = JSON.parse(fs.readFileSync(srcCategoriesPath, 'utf8'));

  const finalData = {
    categories: updatedCategories,
    meta: currentCategoriesData.meta,
    presets: currentCategoriesData.presets
  };

  const finalJson = JSON.stringify(finalData, null, 2);

  fs.writeFileSync(srcCategoriesPath, finalJson, 'utf8');
  console.log(`Successfully updated ${srcCategoriesPath}`);

  if (fs.existsSync(publicCategoriesPath)) {
    fs.writeFileSync(publicCategoriesPath, finalJson, 'utf8');
    console.log(`Successfully updated ${publicCategoriesPath}`);
  }

} catch (error) {
  console.error("Error updating categories.json:", error.message);
  process.exit(1);
}
