import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

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
app.get('/api/tours', (req, res) => res.json(getData('tours.json')));
app.post('/api/tours', (req, res) => { saveData('tours.json', req.body); res.json({ success: true }); });

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

// Serve static files from the React app build directory
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Dynamic Backend is live' });
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});

