const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://bhaktikishakti.com';
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');
const TOURS_DATA_PATH = path.join(__dirname, '..', 'public', 'data', 'tours.json');
const GUIDES_DATA_PATH = path.join(__dirname, '..', 'public', 'data', 'guides.json');
const CATEGORIES_DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'categories.json');

// Static routes to include
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/festivals', priority: '0.8', changefreq: 'weekly' },
  { path: '/tours', priority: '0.9', changefreq: 'daily' },
  { path: '/guides', priority: '0.8', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/bharat-darshan', priority: '0.8', changefreq: 'monthly' },
  { path: '/tours/tours-by-train', priority: '0.8', changefreq: 'weekly' },
  { path: '/gift-cards', priority: '0.7', changefreq: 'monthly' },
  { path: '/referral', priority: '0.7', changefreq: 'monthly' },
  { path: '/tours/compare', priority: '0.6', changefreq: 'monthly' },
  { path: '/guides/safety', priority: '0.7', changefreq: 'monthly' },
];

function generateUrlEntry(path, priority = '0.7', changefreq = 'weekly') {
  const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  console.log('--- Sitemap Generation Started ---');
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Static Routes
  console.log('Adding static routes...');
  STATIC_ROUTES.forEach(route => {
    xml += generateUrlEntry(route.path, route.priority, route.changefreq) + '\n';
  });

  // 2. Tours
  if (fs.existsSync(TOURS_DATA_PATH)) {
    console.log('Processing tours...');
    const tours = JSON.parse(fs.readFileSync(TOURS_DATA_PATH, 'utf8'));
    tours.forEach(tour => {
      if (tour.status !== 'paused' && tour.status !== 'draft') {
        const identifier = tour.slug || tour.id;
        if (identifier) {
          xml += generateUrlEntry(`/tours/${identifier}`, '0.7', 'weekly') + '\n';
        }
      }
    });
  }

  // 3. Guides
  if (fs.existsSync(GUIDES_DATA_PATH)) {
    console.log('Processing guides...');
    const guides = JSON.parse(fs.readFileSync(GUIDES_DATA_PATH, 'utf8'));
    guides.forEach(guide => {
      if (guide.id) {
        xml += generateUrlEntry(`/guides/${guide.id}`, '0.6', 'monthly') + '\n';
      }
    });
  }

  // 4. Categories/Regions/States (Optional SEO improvement)
  if (fs.existsSync(CATEGORIES_DATA_PATH)) {
    console.log('Processing discovery categories...');
    const categoriesData = JSON.parse(fs.readFileSync(CATEGORIES_DATA_PATH, 'utf8'));
    const states = categoriesData.categories?.states || [];
    states.forEach(state => {
      const slug = state.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      xml += generateUrlEntry(`/${slug}`, '0.5', 'monthly') + '\n';
    });
  }

  xml += '</urlset>';

  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log(`✓ Sitemap generated successfully at: ${SITEMAP_PATH}`);
  console.log(`Total URLs: ${xml.split('<url>').length - 1}`);
}

main().catch(err => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
});
