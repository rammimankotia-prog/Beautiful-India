
import fs from 'fs';
const content = fs.readFileSync('c:/xampp/htdocs/bharat_darshan/src/pages/AdminNewTourUploadForm.jsx', 'utf8');

const regex = /<(div|form|main|section|aside)\b|(\/(div|form|main|section|aside)>)/g;
let stack = [];
let match;
let output = [];

while ((match = regex.exec(content)) !== null) {
    const tagName = match[1] || match[2].slice(1, -1);
    const isClosing = !!match[2];
    const lineNum = content.substring(0, match.index).split('\n').length;
    
    if (isClosing) {
        if (stack.length === 0) {
            output.push(`ERROR: Extra closing tag </${tagName}> at line ${lineNum}`);
        } else {
            const last = stack.pop();
            if (last.tag !== tagName) {
                output.push(`ERROR: Mismatch! <${last.tag}> (line ${last.line}) closed by </${tagName}> (line ${lineNum})`);
            }
        }
    } else {
        stack.push({ tag: tagName, line: lineNum });
    }
}

stack.forEach(m => {
    output.push(`UNCLOSED: <${m.tag}> from line ${m.line}`);
});

console.log(output.join('\n'));
