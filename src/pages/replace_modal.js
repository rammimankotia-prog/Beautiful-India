const fs = require('fs');
const path = 'c:/xampp/htdocs/bharat_darshan/src/pages/TourDetailView.jsx';
let content = fs.readFileSync(path, 'utf8');

const startMarker = '{/* Standardized Booking Flow Integration */}';
const endMarker = '      )}'; // We need the one after the modal content

// Find the start index
const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Start marker not found');
    process.exit(1);
}

// Find the first ')}' after the start marker that is at the correct indentation (6 spaces)
const searchFrom = startIndex + startMarker.length;
const closingRegex = /\n      \}\)/g;
closingRegex.lastIndex = searchFrom;
const match = closingRegex.exec(content);

if (!match) {
    console.error('End marker not found');
    process.exit(1);
}

const endIndex = match.index + match[0].length;

const replacement = `      {/* ── Standardized Booking Modal ── */}
      <ConsultSpecialistModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        tour={tour} 
      />`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(path, newContent);
console.log('Successfully replaced legacy modal code.');
