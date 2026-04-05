/**
 * Unified storage keys to prevent inconsistency across the app.
 */
export const STORAGE_KEYS = {
  TOURS: 'beautifulindia_tours_cache',
  ARTICLES: 'beautifulindia_articles_cache',
  CATEGORIES: 'beautifulindia_categories_cache'
};

const lastWriteTime = {};

/**
 * Safely caches tours in localStorage with anti-storm protection.
 * If the quota is exceeded (common with base64 images), it attempts to save a "light" version
 * without images, or clears the cache if even that fails.
 * 
 * @param {string} key - The localStorage key
 * @param {Array} tours - The tours array to cache
 */
export const safeCacheTours = (key, tours) => {
  if (!key || !tours) return;

  // Anti-storm: Avoid redundant writes (5s debounce)
  const now = Date.now();
  if (lastWriteTime[key] && now - lastWriteTime[key] < 5000) return;
  lastWriteTime[key] = now;

  try {
    // Attempt 1: Full save
    localStorage.setItem(key, JSON.stringify(tours));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22 || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.warn(`[Storage] Quota exceeded for "${key}". Attempting to save light version...`);
      
      try {
        // Attempt 2: Light save (strip large data)
        const lightTours = tours.map(tour => ({
          ...tour,
          // Strip base64 images
          image: (typeof tour.image === 'string' && tour.image.startsWith('data:image/')) 
            ? 'cached://base64-stripped' 
            : tour.image,
          images: Array.isArray(tour.images) 
            ? tour.images.map(img => {
                const url = typeof img === 'string' ? img : (img?.url || '');
                if (url.startsWith('data:image/')) {
                  return typeof img === 'object' ? { ...img, url: 'cached://base64-stripped' } : 'cached://base64-stripped';
                }
                return img;
              })
            : tour.images,
          // Strip large text if still failing (handled by the try-catch loop if we were more advanced, 
          // but here we just do a more aggressive strip in one go)
          description: tour.description?.length > 500 ? (tour.description.substring(0, 500) + '...') : tour.description,
          itinerary: Array.isArray(tour.itinerary) && tour.itinerary.length > 5 ? tour.itinerary.slice(0, 5) : tour.itinerary
        }));

        localStorage.setItem(key, JSON.stringify(lightTours));
        console.info(`[Storage] Successfully saved light version to "${key}".`);
      } catch (innerE) {
        console.error(`[Storage] Even light version failed for "${key}". Selective clearing.`, innerE);
        
        // Instead of clearing EVERYTHING, just clear this key and maybe oldest large key
        localStorage.removeItem(key);
        
        // Also clear any large articles cache as it's less critical than tours
        if (key === STORAGE_KEYS.TOURS) {
          localStorage.removeItem(STORAGE_KEYS.ARTICLES);
        }
      }
    } else {
      console.error(`[Storage] Unexpected error while saving to "${key}":`, e);
    }
  }
};

/**
 * Clears all application-specific cache from localStorage.
 */
export const clearAllAppCache = () => {
  const keys = Object.values(STORAGE_KEYS);
  keys.forEach(key => localStorage.removeItem(key));
  
  // Also clear legacy or manual keys
  const legacyKeys = [
    'beautifulindia_cache_reviews',
    'beautifulindia_admin_guides',
    'beautifulindia_article_autosave'
  ];
  legacyKeys.forEach(key => localStorage.removeItem(key));
  
  console.info("[Storage] All application cache cleared.");
};

