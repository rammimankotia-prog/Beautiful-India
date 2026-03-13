const fs = require('fs');
const path = require('path');

const rootSourceDir = path.resolve(__dirname, '..');
const sourceDir = path.resolve(rootSourceDir, 'stitch_wanderlust_explorer_pro_home');
const targetDir = path.resolve(__dirname, 'src', 'pages');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

function toPascalCase(str) {
    let pascal = str
        .split(/[_-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    if (/^[0-9]/.test(pascal)) pascal = 'Page' + pascal;
    return pascal;
}

function convertHtmlToJsx(html) {
    // Extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let content = bodyMatch ? bodyMatch[1] : html;

    // STRIP HEADER AND FOOTER - To allow Layout.jsx to provide reusable versions
    content = content.replace(/<header[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<footer[\s\S]*?<\/footer>/gi, '');

    // Remove scripts
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');

    // Handle style tags
    content = content.replace(/<style>([\s\S]*?)<\/style>/gi, (match, css) => {
        return `<style dangerouslySetInnerHTML={{ __html: \`${css.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />`;
    });

    // Convert HTML comments to JSX comments
    content = content.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

    // Convert class to className
    content = content.replace(/className=/g, 'class='); 
    content = content.replace(/class=/g, 'className=');

    // Convert style strings to objects
    const styleFix = (match, styleStr) => {
        const styles = styleStr.split(';').filter(s => s.trim());
        const styleObj = styles.map(s => {
            const [prop, ...val] = s.split(':');
            const camelProp = prop.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            let value = val.join(':').trim().replace(/"/g, "'");
            return `${camelProp}: "${value}"`;
        }).join(', ');
        return `style={{ ${styleObj} }}`;
    };
    content = content.replace(/style='([^']+)'/g, styleFix);
    content = content.replace(/style="([^"]+)"/g, styleFix);

    // Self-close tags
    const tagsToClose = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    tagsToClose.forEach(tag => {
        const regex = new RegExp(`<${tag}([^>]*[^/])>`, 'gi');
        content = content.replace(regex, `<${tag}$1 />`);
    });

    // Simple React fix for reserved keywords
    content = content.replace(/for=/g, 'htmlFor=');
    content = content.replace(/tabindex=/g, 'tabIndex=');
    
    // SVG attributes
    content = content.replace(/stroke-width=/g, 'strokeWidth=');
    content = content.replace(/stroke-linecap=/g, 'strokeLinecap=');

    return content;
}

const folders = fs.readdirSync(sourceDir).filter(f => fs.statSync(path.join(sourceDir, f)).isDirectory());

const routes = [];

folders.forEach(folder => {
    const htmlPath = path.join(sourceDir, folder, 'code.html');
    if (fs.existsSync(htmlPath)) {
        console.log(`Converting ${folder}...`);
        const html = fs.readFileSync(htmlPath, 'utf8');
        const jsxBody = convertHtmlToJsx(html);
        const componentName = toPascalCase(folder);
        
        const componentCode = `
import React from 'react';
import { Link } from 'react-router-dom';

const ${componentName} = () => {
    return (
        <div className="float-element">
            ${jsxBody}
        </div>
    );
};

export default ${componentName};
`;
        fs.writeFileSync(path.join(targetDir, `${componentName}.jsx`), componentCode);
        
        routes.push({
            name: componentName,
            path: folder === 'wanderlust_explorer_pro_home' ? '/' : `/${folder.replace(/_/g, '-')}`,
            folder: folder
        });
    }
});

// Update Routes
const routesConfig = `
import React from 'react';
import NavigationHub from './pages/NavigationHub';
${routes.map(r => `import ${r.name} from './pages/${r.name}';`).join('\n')}

export const routes = [
    { path: "/nav", element: <NavigationHub /> },
    ${routes.map(r => `{ path: "${r.path}", element: <${r.name} /> }`).join(',\n    ')}
];
`;

fs.writeFileSync(path.join(__dirname, 'src', 'routes.jsx'), routesConfig);

console.log('Final Conversion Complete. Header/Footer stripped for reusable injection.');
