<?php
/**
 * Dynamic Sitemap Generator for bhaktikishakti.com
 *
 * Automatically includes:
 *  - All static pages (defined below)
 *  - All published tours from data/tours.json
 *  - All published guides from data/guides.json
 *  - All bike tours from data/bike-tours.json
 *
 * Served at /sitemap.xml via .htaccess rewrite.
 * Every new tour/guide/bike-tour is automatically indexed.
 */

header('Content-Type: application/xml; charset=utf-8');
header('X-Robots-Tag: noindex'); // Don't index the generator itself

$BASE   = 'https://bhaktikishakti.com';
$today  = date('Y-m-d');
$dataDir = __DIR__ . '/data';

// ── Helper ───────────────────────────────────────────────────────────────────
function readJson($path) {
    if (!file_exists($path)) return [];
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function urlEntry($loc, $lastmod, $changefreq, $priority) {
    return "  <url>\n"
         . "    <loc>" . htmlspecialchars($loc, ENT_XML1) . "</loc>\n"
         . "    <lastmod>{$lastmod}</lastmod>\n"
         . "    <changefreq>{$changefreq}</changefreq>\n"
         . "    <priority>{$priority}</priority>\n"
         . "  </url>\n";
}

// ── Static Pages ─────────────────────────────────────────────────────────────
$staticPages = [
    // [path, changefreq, priority]
    ['/',                       'daily',   '1.0'],
    ['/tours',                  'daily',   '0.9'],
    ['/guides',                 'daily',   '0.9'],
    ['/festivals',              'weekly',  '0.8'],
    ['/festivals#holi',         'weekly',  '0.7'],
    ['/festivals#diwali',       'weekly',  '0.7'],
    ['/festivals#holi',         'weekly',  '0.7'],
    ['/festivals#navratri',     'weekly',  '0.6'],
    ['/tours/bike-tours',       'weekly',  '0.8'],
    ['/tours/tours-by-train',   'weekly',  '0.8'],
    ['/tours/compare',          'monthly', '0.6'],
    ['/bharat-darshan',         'monthly', '0.8'],
    ['/guides/safety',          'monthly', '0.7'],
    ['/about',                  'monthly', '0.8'],
    ['/contact',                'monthly', '0.8'],
    ['/referral',               'monthly', '0.7'],
    ['/gift-cards',             'monthly', '0.7'],
    ['/account/wishlist',       'monthly', '0.5'],
    ['/account/packing-list',   'monthly', '0.5'],
    ['/privacy',                'yearly',  '0.3'],
    ['/terms',                  'yearly',  '0.3'],
    // Destination / state pages
    ['/andaman-and-nicobar-islands',                    'monthly', '0.5'],
    ['/andhra-pradesh',                                 'monthly', '0.5'],
    ['/arunachal-pradesh',                              'monthly', '0.5'],
    ['/assam',                                          'monthly', '0.5'],
    ['/bihar',                                          'monthly', '0.5'],
    ['/chandigarh',                                     'monthly', '0.5'],
    ['/chhattisgarh',                                   'monthly', '0.5'],
    ['/dadra-and-nagar-haveli-and-daman-and-diu',       'monthly', '0.5'],
    ['/delhi',                                          'monthly', '0.5'],
    ['/goa',                                            'monthly', '0.5'],
    ['/gujarat',                                        'monthly', '0.5'],
    ['/haryana',                                        'monthly', '0.5'],
    ['/himachal-pradesh',                               'monthly', '0.5'],
    ['/jammu-and-kashmir',                              'monthly', '0.5'],
    ['/jharkhand',                                      'monthly', '0.5'],
    ['/karnataka',                                      'monthly', '0.5'],
    ['/kerala',                                         'monthly', '0.5'],
    ['/ladakh',                                         'monthly', '0.5'],
    ['/lakshadweep',                                    'monthly', '0.5'],
    ['/madhya-pradesh',                                 'monthly', '0.5'],
    ['/maharashtra',                                    'monthly', '0.5'],
    ['/manipur',                                        'monthly', '0.5'],
    ['/meghalaya',                                      'monthly', '0.5'],
    ['/mizoram',                                        'monthly', '0.5'],
    ['/nagaland',                                       'monthly', '0.5'],
    ['/odisha',                                         'monthly', '0.5'],
    ['/puducherry',                                     'monthly', '0.5'],
    ['/punjab',                                         'monthly', '0.5'],
    ['/rajasthan',                                      'monthly', '0.5'],
    ['/sikkim',                                         'monthly', '0.5'],
    ['/tamil-nadu',                                     'monthly', '0.5'],
    ['/telangana',                                      'monthly', '0.5'],
    ['/tripura',                                        'monthly', '0.5'],
    ['/uttar-pradesh',                                  'monthly', '0.5'],
    ['/uttarakhand',                                    'monthly', '0.5'],
    ['/west-bengal',                                    'monthly', '0.5'],
];

// ── Build XML ─────────────────────────────────────────────────────────────────
$xml  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' . "\n";
$xml .= '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";

// 1. Static pages
foreach ($staticPages as [$path, $freq, $pri]) {
    $xml .= urlEntry($BASE . $path, $today, $freq, $pri);
}

// 2. Tours (dynamic)
$tours = readJson($dataDir . '/tours.json');
$seenTourSlugs = [];
foreach ($tours as $tour) {
    if (($tour['status'] ?? '') === 'draft') continue;
    $slug = $tour['slug'] ?? ($tour['id'] ?? null);
    if (!$slug || in_array($slug, $seenTourSlugs)) continue;
    $seenTourSlugs[] = $slug;
    $lastmod = isset($tour['updatedAt']) ? date('Y-m-d', strtotime($tour['updatedAt']))
             : (isset($tour['date'])     ? date('Y-m-d', strtotime($tour['date']))
             : $today);
    $xml .= urlEntry($BASE . '/tours/' . $slug, $lastmod, 'weekly', '0.7');
}

// 3. Travel Guides (dynamic)
$guides = readJson($dataDir . '/guides.json');
$seenGuideSlugs = [];
foreach ($guides as $guide) {
    if (($guide['status'] ?? '') === 'draft') continue;
    $slug = $guide['slug'] ?? ($guide['id'] ?? null);
    if (!$slug || in_array($slug, $seenGuideSlugs)) continue;
    $seenGuideSlugs[] = $slug;
    $lastmod = isset($guide['date']) ? date('Y-m-d', strtotime($guide['date'])) : $today;
    $xml .= urlEntry($BASE . '/guides/' . $slug, $lastmod, 'weekly', '0.8');
}

// 4. Bike Tours (dynamic)
$bikeTours = readJson($dataDir . '/bike-tours.json');
foreach ($bikeTours as $tour) {
    if (($tour['status'] ?? '') === 'draft') continue;
    $slug = $tour['slug'] ?? ($tour['id'] ?? null);
    if (!$slug) continue;
    $lastmod = isset($tour['updatedAt']) ? date('Y-m-d', strtotime($tour['updatedAt'])) : $today;
    $xml .= urlEntry($BASE . '/tours/bike-tours/' . $slug, $lastmod, 'weekly', '0.7');
}

$xml .= '</urlset>';

echo $xml;
?>
