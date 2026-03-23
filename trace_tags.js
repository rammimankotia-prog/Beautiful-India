
import fs from 'fs';
const content = fs.readFileSync('c:/xampp/htdocs/bharat_darshan/src/pages/AdminNewTourUploadForm.jsx', 'utf8');

const regex = /<(div|form|main|section|aside)\b|(\/(div|form|main|section|aside)>)/g;
let stack = [];
let match;
let lastMatchingLine = 0;

while ((match = regex.exec(content)) !== null) {
    const tagName = match[1] || match[2].slice(1, -1);
    const isClosing = !!match[2];
    const lineNum = content.substring(0, match.index).split('\n').length;
    
    if (isClosing) {
        if (stack.length === 0) {
            console.log(`Extra closing </${tagName}> at line ${lineNum}`);
        } else {
            const last = stack.pop();
            if (last.tag !== tagName) {
                console.log(`Mismatch at line ${lineNum}: </${tagName}> vs <${last.tag}> (from line ${last.line})`);
                console.log("Current Stack: ", stack.map(s => `${s.tag}(${s.line})`).join(' -> '));
                process.exit(1);
            }
        }
    } else {
        stack.push({ tag: tagName, line: lineNum });
    }
}
console.log("Balanced! Unclosed: ", stack.map(s => `${s.tag}(${s.line})`).join(' -> '));
