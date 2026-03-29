import mongoose from 'mongoose';

const bikeTourSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  subtitle: { 
    type: String, 
    trim: true
  },
  duration: { 
    type: String, 
    required: true
  },
  coveredPlaces: [{ 
    type: String,
    trim: true
  }],
  destination: { 
    type: String,
    required: true
  },
  country: { 
    type: String,
    required: true
  },
  tourType: { 
    type: String,
    enum: ['Bike', 'Bicycle'],
    default: 'Bicycle'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging'],
    default: 'Easy'
  },
  equipment: [{
    type: String,
    enum: ['Helmet', 'Water', 'E-bike', 'Road bike', 'Repair Kit', 'First Aid']
  }],
  pricing: {
    perPerson: { type: Number, default: 0 },
    perCouple: { type: Number, default: 0 },
    perGroup: {
      price: { type: Number, default: 0 },
      minPersons: { type: Number, default: 1 }
    }
  },
  mainImage: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  content: {
    type: String, // Stored as HTML article
    default: ''
  },
  schemaMarkup: {
    type: String, // Stored as JSON string
    default: ''
  },
  showInMenu: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'draft'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  highlights: [{
    type: String
  }],
  whatsIncluded: [{
    type: String
  }]
}, { timestamps: true });

// Pre-save hook to generate slug if not provided? 
// No, the user wants to provide it in the form.

const BikeTour = mongoose.model('BikeTour', bikeTourSchema);
export default BikeTour;
