
const fs = require('fs');
const content = fs.readFileSync('c:/xampp/htdocs/bharat_darshan/src/data/guides.json', 'utf8');
const guides = JSON.parse(content);
const guide = guides.find(g => g.id === 'dharamshala-mcleodganj-travel-guide-himachal');

if (guide) {
  console.log("Guide Found!");
  console.log("Content Length:", guide.content.length);
  if (guide.content.includes('application/ld+json')) {
    console.log("Script block FOUND in content!");
    const start = guide.content.indexOf('<script');
    const end = guide.content.indexOf('</script>') + 9;
    console.log("Script Block:", guide.content.substring(start, end));
  } else {
    console.log("Script block NOT found in content.");
  }
  
  if (guide.schemaSnippet) {
    console.log("Schema Snippet FOUND in guide object!");
    console.log("Snippet:", guide.schemaSnippet);
  } else {
    console.log("Schema Snippet NOT found in guide object.");
  }
} else {
  console.log("Guide NOT found!");
}
