/**
 * Safely caches tours in localStorage.
 * If the quota is exceeded (common with base64 images), it attempts to save a "light" version
 * without images, or clears the cache if even that fails.
 * 
 * @param {string} key - The localStorage key
 * @param {Array} tours - The tours array to cache
 */
export const safeCacheTours = (key, tours) => {
  if (!key || !tours) return;

  try {
    // Attempt 1: Full save
    localStorage.setItem(key, JSON.stringify(tours));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22 || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.warn(`[Storage] Quota exceeded for "${key}". Attempting to save light version...`);
      
      try {
        // Attempt 2: Light save (strip large base64 strings)
        const lightTours = tours.map(tour => ({
          ...tour,
          // If image is a base64 string, replace it with a placeholder or empty string
          image: (typeof tour.image === 'string' && tour.image.startsWith('data:image/')) 
            ? 'cached://base64-stripped' 
            : tour.image,
          // Handle the images array as well
          images: Array.isArray(tour.images) 
            ? tour.images.map(img => {
                const url = typeof img === 'string' ? img : (img?.url || '');
                if (url.startsWith('data:image/')) {
                  return typeof img === 'object' ? { ...img, url: 'cached://base64-stripped' } : 'cached://base64-stripped';
                }
                return img;
              })
            : tour.images
        }));

        localStorage.setItem(key, JSON.stringify(lightTours));
        console.info(`[Storage] Successfully saved light version to "${key}".`);
      } catch (innerE) {
        console.error(`[Storage] Even light version failed for "${key}". Clearing cache.`, innerE);
        localStorage.removeItem(key);
      }
    } else {
      console.error(`[Storage] Unexpected error while saving to "${key}":`, e);
    }
  }
};
