import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

import tourRoutes from './src/routes/tourRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Enable CORS for all routes BEFORE JSON parsing to handle large payloads nicely
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// Helper to read/write JSON files
const getData = (filename) => JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data', filename), 'utf8'));
const saveData = (filename, data) => fs.writeFileSync(path.join(__dirname, 'src/data', filename), JSON.stringify(data, null, 2));

// API Routes
app.use('/api/v1/tours', tourRoutes);

app.get('/api/bookings', (req, res) => res.json(getData('bookings.json')));
app.post('/api/bookings', (req, res) => { saveData('bookings.json', req.body); res.json({ success: true }); });

app.get('/api/leads', (req, res) => res.json(getData('leads.json')));
app.post('/api/leads', (req, res) => { saveData('leads.json', req.body); res.json({ success: true }); });

app.get('/api/agents', (req, res) => res.json(getData('agents.json')));
app.post('/api/agents', (req, res) => { saveData('agents.json', req.body); res.json({ success: true }); });

app.get('/api/guides', (req, res) => res.json(getData('guides.json')));
app.post('/api/guides', (req, res) => { saveData('guides.json', req.body); res.json({ success: true }); });

app.get('/api/reviews', (req, res) => res.json(getData('reviews.json')));
app.post('/api/reviews', (req, res) => { saveData('reviews.json', req.body); res.json({ success: true }); });

app.get('/api/themes', (req, res) => res.json(getData('themes.json')));
app.post('/api/themes', (req, res) => { saveData('themes.json', req.body); res.json({ success: true }); });

app.get('/api/chatflow', (req, res) => res.json(getData('chatflow.json')));
app.post('/api/chatflow', (req, res) => { saveData('chatflow.json', req.body); res.json({ success: true }); });

app.get('/api/chatbot-manual-qa', (req, res) => res.json(getData('manual-qa.json')));
app.post('/api/chatbot-manual-qa', (req, res) => { saveData('manual-qa.json', req.body); res.json({ success: true }); });

// Custom route for categorization settings to keep meta and presets unmutated
app.post('/api/save-categories', (req, res) => {
    try {
        const srcPath = path.join(__dirname, 'src/data/categories.json');
        const publicPath = path.join(__dirname, 'public/data/categories.json');
        
        // Read current to keep meta and presets
        let currentObj = { meta: {}, presets: {} };
        if (fs.existsSync(srcPath)) {
            currentObj = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
        }
        
        const finalData = {
            categories: req.body,
            meta: currentObj.meta,
            presets: currentObj.presets
        };
        
        const jsonStr = JSON.stringify(finalData, null, 2);
        fs.writeFileSync(srcPath, jsonStr, 'utf8');
        
        if (fs.existsSync(publicPath)) {
            fs.writeFileSync(publicPath, jsonStr, 'utf8');
        }
        res.json({ success: true, message: 'Categories saved successfully' });
    } catch (error) {
        console.error('Save Categories Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// New endpoint for saving tours permanently
app.post('/api/save-tours', (req, res) => {
    try {
        const srcPath = path.join(__dirname, 'src/data/tours.json');
        const publicPath = path.join(__dirname, 'public/data/tours.json');
        const jsonStr = JSON.stringify(req.body, null, 2);
        fs.writeFileSync(srcPath, jsonStr, 'utf8');
        if (fs.existsSync(publicPath)) {
            fs.writeFileSync(publicPath, jsonStr, 'utf8');
        }
        res.json({ success: true, message: 'Tours saved successfully' });
    } catch (error) {
        console.error('Save Tours Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve static files from the React app build directory
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // Handle SPA routing - serve index.html for any unknown routes
    app.get('*', (req, res) => {
        // If it starts with /api, we should have already handled it or it's a 404
        if (req.url.startsWith('/api')) {
            return res.status(404).json({ error: 'API route not found' });
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    // Health check for dev mode if dist doesn't exist
    app.get('/api/health', (req, res) => {
        res.json({ status: 'Dynamic Backend is live (Dev Mode - dist not found)' });
    });
}

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
    if (fs.existsSync(distPath)) {
        console.log(`Serving frontend from: ${distPath}`);
    }
});
