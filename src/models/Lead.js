import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    trim: true
  },
  phone: { 
    type: String, 
    trim: true
  },
  requestedTourId: { 
    type: String 
  },
  requestedTourName: { 
    type: String 
  },
  conversationHistory: [{
    role: { type: String, enum: ['user', 'bot'] },
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
