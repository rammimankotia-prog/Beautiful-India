const fs = require('fs');
const path = 'c:/xampp/htdocs/bharat_darshan/src/pages/TourDetailView.jsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Add Import
if (!content.includes("import BikeTourMap")) {
    content = content.replace(
        "import ConsultSpecialistModal from '../components/ConsultSpecialistModal';",
        "import ConsultSpecialistModal from '../components/ConsultSpecialistModal';\nimport BikeTourMap from '../components/BikeTourMap';"
    );
}

// 2. Remove Unused State
content = content.replace(/const \[openFaq, setOpenFaq\] = useState\(null\);\n\s*/, '');
content = content.replace(/const \[numDays, setNumDays\] = useState\(10\);\n\s*/, '');

// 3. Inject Route Map Section
const mapSection = `
                  {/* Route Map Section */}
                  {(tour.mapData || tour.coordinates) && (
                    <div id="section-map" className="flex flex-col gap-6 mt-12 scroll-mt-24">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Route Map</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded">Interactive</span>
                      </div>
                      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm h-[400px] md:h-[500px]">
                        <BikeTourMap slug={tour.slug} title={tour.title} tour={tour} />
                      </div>
                    </div>
                  )}
`;

if (!content.includes('id="section-map"')) {
    // Insert after the itinerary container div ends
    // We look for the itinerary render block and insert after it.
    // Based on previous view_file, the itinerary section usually ends with </div>\n                  </div>
    content = content.replace(
        '                  {/* Itinerary */}\n                  <div id="section-itinerary" className="flex flex-col gap-6 mt-4 scroll-mt-24">',
        '                  {/* Itinerary */}\n                  <div id="section-itinerary" className="flex flex-col gap-6 mt-4 scroll-mt-24">'
    );

    // Let's find a more unique anchor.
    // The itinerary button ends around line 609
    const itineraryEndMarker = '                      )}\n                    </div>\n                  </div>';
    if (content.includes(itineraryEndMarker)) {
        content = content.replace(itineraryEndMarker, itineraryEndMarker + mapSection);
    } else {
        // Fallback: search for a simpler version
        content = content.replace('                    </div>\n                  </div>\n\n                  {/* Inclusions', '                    </div>\n                  </div>\n' + mapSection + '\n                  {/* Inclusions');
    }
}

fs.writeFileSync(path, content);
console.log('Standardization complete.');
