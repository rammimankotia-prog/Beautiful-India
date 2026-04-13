import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  subtitle: { 
    type: String, 
    trim: true
  },
  tags: [{ 
    type: String,
    trim: true
  }],
  coveredPlaces: [{ 
    type: String,
    trim: true
  }],
  duration: { 
    type: String, 
    required: true
  },
  bestTimeToVisit: { 
    type: String
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  actionLink: { 
    type: String
  },
  image: {
    type: String,
    required: true
  },
  homePagePlacements: [{
    type: String,
    enum: [
      'Popular Destinations',
      'Recommended Tour Packages',
      'Top 4 Metro Cities of India',
      'Travel by Train',
      'None'
    ],
    default: ['None']
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'draft'],
    default: 'draft'
  },
  itinerary: mongoose.Schema.Types.Mixed,
  faq: mongoose.Schema.Types.Mixed,
  priceBasis: String,
  minPersons: Number,
  nature: String,
  theme: String,
  destination: String,
  stateRegion: String,
  subregion: String,
  order: Number,
  images: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
