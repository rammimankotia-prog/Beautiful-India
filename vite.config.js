import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to handle saving categories in dev mode
const saveCategoriesPlugin = () => ({
  name: 'save-categories',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/save-categories' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const srcPath = path.resolve('src/data/categories.json');
            const publicPath = path.resolve('public/data/categories.json');
            
            // Read current to keep meta and presets if not provided
            const currentObj = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
            const finalData = {
              categories: data,
              meta: currentObj.meta,
              presets: currentObj.presets
            };
            
            const jsonStr = JSON.stringify(finalData, null, 2);
            fs.writeFileSync(srcPath, jsonStr, 'utf8');
            if (fs.existsSync(publicPath)) {
              fs.writeFileSync(publicPath, jsonStr, 'utf8');
            }
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Categories saved successfully' }));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

// Automated deployment triggered: 2026-03-14 17:01:00
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), saveCategoriesPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
