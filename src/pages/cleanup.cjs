const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'TourDetailView.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '{/* START_MODAL_CLEANUP */}';
// We know there's an unbalanced ')}' at line 1377 (or nearby)
// Since we removed the opening '{isQuoteModalOpen && (' but kept the closing ')}'

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Start marker not found');
    process.exit(1);
}

// Find the unbalanced ')}' at the bottom of the main component
// It should be followed by a newline and then '    </div>'
const endMarker = '      )}\n\n    </div>';
// Let's try a more flexible search for the end marker
const endIndex = content.lastIndexOf('      )}');

if (endIndex === -1 || endIndex < startIndex) {
    console.error('End marker not found or invalid');
    process.exit(1);
}

const replacement = `      {/* ── Standardized Booking Modal ── */}
      <ConsultSpecialistModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        tour={tour} 
      />
`;

const finalContent = content.substring(0, startIndex) + replacement + content.substring(endIndex + 8); // 8 is length of '      )}'

fs.writeFileSync(filePath, finalContent);
console.log('Successfully refactored TourDetailView.jsx');
