import Lead from '../models/Lead.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to update local JSON data (Sync with Dashboard)
const syncToJson = (filename, newEntry) => {
    try {
        const dataPath = path.join(__dirname, '../../src/data', filename);
        const publicPath = path.join(__dirname, '../../public/data', filename);
        
        let data = [];
        if (fs.existsSync(dataPath)) {
            data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        }
        
        data.push(newEntry);
        const jsonStr = JSON.stringify(data, null, 2);
        
        fs.writeFileSync(dataPath, jsonStr, 'utf8');
        if (fs.existsSync(path.dirname(publicPath))) {
            fs.writeFileSync(publicPath, jsonStr, 'utf8');
        }
    } catch (err) {
        console.error("JSON Sync Error:", err);
    }
};

// @desc    Recommend tours based on text query (simple keyword matching)
// @route   POST /api/v1/chatbot/recommend
// @access  Public
export const recommendTours = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.json([]);
        }

        const lowerText = text.toLowerCase();
        const activeTours = await Tour.find({ isChatbotEnabled: true, status: 'active' });

        // Scoring algorithm
        const scoredTours = activeTours.map(tour => {
            let score = 0;

            // 1. Check Chatbot Category (High weight)
            if (tour.chatbotCategory && lowerText.includes(tour.chatbotCategory.toLowerCase())) {
                score += 10;
            }

            // 2. Check Regions
            if (tour.chatbotRegions && tour.chatbotRegions.length > 0) {
                tour.chatbotRegions.forEach(region => {
                    if (lowerText.includes(region.toLowerCase())) {
                        score += 5;
                    }
                });
            }

            // 3. Check specific Tags
            if (tour.chatbotTags && tour.chatbotTags.length > 0) {
                tour.chatbotTags.forEach(tag => {
                    if (lowerText.includes(tag.toLowerCase())) {
                        score += 3;
                    }
                });
            }

            return { ...tour.toObject(), score };
        });

        // Sort by score descending, then fallback to order if scores tie
        scoredTours.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return (a.order || 999) - (b.order || 999);
        });

        // If no score above 0, return top general recommendations
        const topMatches = scoredTours.filter(t => t.score > 0).slice(0, 3);
        const results = topMatches.length > 0 ? topMatches : scoredTours.slice(0, 3);

        const mappedResults = results.map(t => ({
            _id: t._id,
            title: t.title,
            chatbotTeaser: t.chatbotTeaser || t.subtitle || 'A wonderful experience awaits.'
        }));

        res.json(mappedResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Capture lead from chatbot
// @route   POST /api/v1/chatbot/lead
// @access  Public
export const captureLead = async (req, res) => {
    try {
        const { name, email, phone, requestedTourId, requestedTourName, conversationHistory } = req.body;

        const newLead = new Lead({
            name,
            email,
            phone,
            requestedTourId,
            requestedTourName,
            conversationHistory
        });

        await newLead.save();

        // Sync to JSON for Overview Dashboard compatibility
        syncToJson('leads.json', {
            id: newLead._id,
            name: name,
            email: email,
            phone: phone,
            to: requestedTourName || 'General Inquiry',
            source: 'Chatbot',
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            status: 'New'
        });

        res.status(201).json({ success: true, message: 'Lead captured effectively' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
