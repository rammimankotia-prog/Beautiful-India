
import fs from 'fs';
const content = fs.readFileSync('c:/xampp/htdocs/bharat_darshan/src/pages/AdminNewTourUploadForm.jsx', 'utf8');

const regex = /<(div|form|main)\b|(\/(div|form|main)>)/g;
let stack = [];
let match;

while ((match = regex.exec(content)) !== null) {
    const tagName = match[1] || match[2].slice(1, -1);
    const isClosing = !!match[2];
    const lineNum = content.substring(0, match.index).split('\n').length;
    
    if (isClosing) {
        if (stack.length === 0 || stack[stack.length - 1].tag !== tagName) {
            console.log(`Mismatch/Extra closing tag: </${tagName}> at line ${lineNum}`);
            if (stack.length > 0) {
                console.log(`Expected matching tag for <${stack[stack.length - 1].tag}> from line ${stack[stack.length - 1].line}`);
            }
        } else {
            stack.pop();
        }
    } else {
        stack.push({ tag: tagName, line: lineNum });
    }
}

stack.forEach(m => {
    console.log(`Unclosed tag: <${m.tag}> from line ${m.line}`);
});
