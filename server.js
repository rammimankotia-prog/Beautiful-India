import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

import tourRoutes from './src/routes/tourRoutes.js';
import bikeTourRoutes from './src/routes/bikeTourRoutes.js';

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
const getData = (filename) => {
    const srcPath = path.join(__dirname, 'src/data', filename);
    const publicPath = path.join(__dirname, 'public/data', filename);
    if (fs.existsSync(srcPath)) return JSON.parse(fs.readFileSync(srcPath, 'utf8'));
    if (fs.existsSync(publicPath)) return JSON.parse(fs.readFileSync(publicPath, 'utf8'));
    return [];
};

const saveData = (filename, data) => {
    const srcPath = path.join(__dirname, 'src/data', filename);
    const publicPath = path.join(__dirname, 'public/data', filename);
    const jsonStr = JSON.stringify(data, null, 2);
    
    fs.writeFileSync(srcPath, jsonStr, 'utf8');
    if (fs.existsSync(path.dirname(publicPath))) {
        fs.writeFileSync(publicPath, jsonStr, 'utf8');
    }
};

// API Routes
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/bike-tours', bikeTourRoutes);

app.get('/api/leads', (req, res) => res.json(getData('leads.json')));
app.post('/api/leads', (req, res) => {
    try {
        const payload = req.body;
        let existingLeads = getData('leads.json');
        
        // If it's an array, it's coming from Admin Dashboard Sync (overwrite)
        if (Array.isArray(payload)) {
            saveData('leads.json', payload);
        } else {
            // It's a single lead from Chatbot or Tour Form (append)
            existingLeads.unshift(payload);
            saveData('leads.json', existingLeads);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.delete('/api/leads', (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ success: false, message: 'ID required' });
        const data = getData('leads.json');
        const filtered = data.filter(item => String(item.id) !== String(id));
        saveData('leads.json', filtered);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/chatflow', (req, res) => { saveData('chatflow.json', req.body); res.json({ success: true }); });
app.post('/api/manual-qa', (req, res) => { saveData('manual-qa.json', req.body); res.json({ success: true }); });

app.get('/api/bookings', (req, res) => res.json(getData('bookings.json')));
app.post('/api/bookings', (req, res) => { saveData('bookings.json', req.body); res.json({ success: true }); });

app.get('/api/train-queries', (req, res) => {
    if (!fs.existsSync(path.join(__dirname, 'src/data', 'train_queries.json'))) {
        saveData('train_queries.json', []);
    }
    res.json(getData('train_queries.json'));
});
app.post('/api/train-queries', (req, res) => {
    const queries = fs.existsSync(path.join(__dirname, 'src/data', 'train_queries.json')) 
        ? getData('train_queries.json') 
        : [];
    const newQuery = {
        ...req.body,
        id: 'TQ-' + Date.now(),
        timestamp: new Date().toISOString(),
        status: 'New'
    };
    queries.push(newQuery);
    saveData('train_queries.json', queries);
    res.json({ success: true, query: newQuery });
});

app.patch('/api/train-queries', (req, res) => {
    try {
        const { id, status } = req.body;
        if (!id || !status) return res.status(400).json({ success: false, message: 'ID and status required' });
        
        const queries = getData('train_queries.json');
        const index = queries.findIndex(q => q.id === id);
        if (index !== -1) {
            queries[index].status = status;
            saveData('train_queries.json', queries);
            res.json({ success: true, message: 'Status updated' });
        } else {
            res.status(404).json({ success: false, message: 'Query not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/train-queries', (req, res) => {
    try {
        const id = req.query.id || req.body.id;
        if (!id) return res.status(400).json({ success: false, message: 'ID required' });
        
        const queries = getData('train_queries.json');
        const filtered = queries.filter(q => q.id !== id);
        if (filtered.length < queries.length) {
            saveData('train_queries.json', filtered);
            res.json({ success: true, message: 'Query deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Query not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


app.get('/api/agents', (req, res) => res.json(getData('agents.json')));
app.post('/api/agents', (req, res) => { saveData('agents.json', req.body); res.json({ success: true }); });

app.get('/api/guides', (req, res) => res.json(getData('guides.json')));
app.get('/api/save-guides', (req, res) => res.json(getData('guides.json'))); 

app.post('/api/save-guides', (req, res) => {
    try {
        const payload = req.body;
        if (!payload) {
            return res.status(400).json({ success: false, error: 'Missing payload' });
        }

        const srcPath = path.join(__dirname, 'src/data/guides.json');
        const publicPath = path.join(__dirname, 'public/data/guides.json');
        
        // 1. Read existing data
        let guides = [];
        if (fs.existsSync(srcPath)) {
            guides = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
        } else if (fs.existsSync(publicPath)) {
            guides = JSON.parse(fs.readFileSync(publicPath, 'utf8'));
        }

        let finalData = [];

        // MODE A: Safe Delete (Accepts updated list)
        if (payload.isDeleteAction && payload.updatedList) {
            finalData = payload.updatedList;
        }
        // MODE B: Atomic Update (Single article)
        else if (payload.id) {
            const index = guides.findIndex(g => String(g.id) === String(payload.id));
            if (index !== -1) {
                guides[index] = { ...guides[index], ...payload };
            } else {
                guides.push(payload);
            }
            finalData = guides;
        } else {
            return res.status(400).json({ success: false, error: 'Invalid payload format' });
        }

        // 3. Save back
        const jsonStr = JSON.stringify(finalData, null, 2);
        fs.writeFileSync(srcPath, jsonStr, 'utf8');
        if (fs.existsSync(publicPath)) {
            fs.writeFileSync(publicPath, jsonStr, 'utf8');
        }

        res.json({ success: true, message: 'Guides synced atomically.' });
    } catch (error) {
        console.error('Save Guides Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error while saving guides' });
    }
});



app.post('/api/guides', (req, res) => { saveData('guides.json', req.body); res.json({ success: true }); });


app.get('/api/reviews', (req, res) => res.json(getData('reviews.json')));
app.post('/api/reviews', (req, res) => { saveData('reviews.json', req.body); res.json({ success: true }); });

// Custom route for saving a single review
app.post('/api/save-review', (req, res) => {
    try {
        const srcPath = path.join(__dirname, 'src/data/reviews.json');
        const publicPath = path.join(__dirname, 'public/data/reviews.json');
        
        let reviews = [];
        if (fs.existsSync(srcPath)) {
            reviews = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
        }
        
        const newReview = req.body;
        if (!newReview.id) newReview.id = 'REV-' + Date.now();
        if (!newReview.createdAt) newReview.createdAt = new Date().toISOString();
        
        reviews.unshift(newReview);
        
        fs.writeFileSync(srcPath, JSON.stringify(reviews, null, 2));
        if (fs.existsSync(path.dirname(publicPath))) {
            fs.writeFileSync(publicPath, JSON.stringify(reviews, null, 2));
        }
        
        res.json({ success: true, message: 'Review saved locally', review: newReview });
    } catch (err) {
        console.error("Save Review Error:", err);
        res.status(500).json({ error: 'Failed to write review data' });
    }
});

app.get('/api/themes', (req, res) => res.json(getData('themes.json')));
app.post('/api/themes', (req, res) => { saveData('themes.json', req.body); res.json({ success: true }); });

app.get('/api/chatflow', (req, res) => res.json(getData('chatflow.json')));
app.post('/api/chatflow', (req, res) => { saveData('chatflow.json', req.body); res.json({ success: true }); });

app.get('/api/chatbot-manual-qa', (req, res) => res.json(getData('manual-qa.json')));
app.post('/api/chatbot-manual-qa', (req, res) => { saveData('manual-qa.json', req.body); res.json({ success: true }); });

app.get('/api/settings', (req, res) => res.json(getData('settings.json')));
app.post('/api/save-settings', (req, res) => { saveData('settings.json', req.body); res.json({ success: true }); });

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
    app.use((req, res) => {
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
