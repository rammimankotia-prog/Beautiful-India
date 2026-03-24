
// Mocking localStorage for Node.js test environment
const mockLocalStorage = {
  store: {},
  quota: 100, // Very small quota for testing (characters)
  setItem(key, value) {
    const size = value.length;
    let currentTotal = 0;
    for (const k in this.store) currentTotal += this.store[k].length;
    
    if (currentTotal + size > this.quota) {
      const e = new Error('QuotaExceededError');
      e.name = 'QuotaExceededError';
      throw e;
    }
    this.store[key] = value;
  },
  getItem(key) {
    return this.store[key] || null;
  },
  removeItem(key) {
    delete this.store[key];
  }
};

global.localStorage = mockLocalStorage;

// Import the function logic (copying here because I can't easily import from ESM to CommonJS in this environment without extra setup)
const safeCacheTours = (key, tours) => {
  if (!key || !tours) return;

  try {
    // Attempt 1: Full save
    localStorage.setItem(key, JSON.stringify(tours));
    console.log(`[Test] Saved full version of "${key}"`);
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn(`[Test] Quota exceeded for "${key}". Attempting to save light version...`);
      
      try {
        // Attempt 2: Light save (strip large base64 strings)
        const lightTours = tours.map(tour => ({
          ...tour,
          image: (typeof tour.image === 'string' && tour.image.startsWith('data:image/')) 
            ? 'cached' 
            : tour.image,
          images: Array.isArray(tour.images) 
            ? tour.images.map(img => {
                const url = typeof img === 'string' ? img : (img?.url || '');
                if (url.startsWith('data:image/')) {
                  return typeof img === 'object' ? { ...img, url: 'cached' } : 'cached';
                }
                return img;
              })
            : tour.images
        }));

        localStorage.setItem(key, JSON.stringify(lightTours));
        console.log(`[Test] Saved light version of "${key}"`);
      } catch (innerE) {
        console.error(`[Test] Even light version failed. Clearing cache.`);
        localStorage.removeItem(key);
      }
    }
  }
};

// --- Test Cases ---

console.log("--- Starting Tests ---");

// Test 1: Small data should save fine
const smallTours = [{ id: 1, title: 'Small' }];
safeCacheTours('test_small', smallTours);
if (localStorage.getItem('test_small')) console.log("Test 1 Passed: Small data saved.");

// Test 2: Large data with base64 images should trigger "light" save
// Creating a string that will exceed the 100 char quota but if stripped will fit
const largeBase64 = "data:image/png;base64," + "A".repeat(80);
const largeTours = [{ id: 2, title: 'Large', image: largeBase64 }];
// Full JSON would be circa 120 chars: [{"id":2,"title":"Large","image":"data:image/png;base64,AAAA..."}]
// Light JSON would be circa 40 chars: [{"id":2,"title":"Large","image":"cached"}]

console.log("Test 2: Saving large data...");
safeCacheTours('test_large', largeTours);
const savedLarge = JSON.parse(localStorage.getItem('test_large'));
if (savedLarge && savedLarge[0].image === 'cached') {
  console.log("Test 2 Passed: Large data saved as light version.");
} else {
  console.log("Test 2 Failed", savedLarge);
}

// Test 3: Extremely large data that doesn't fit even when light
const superLargeTours = [{ id: 3, title: 'Super Large' + "B".repeat(200) }];
console.log("Test 3: Saving super large data...");
safeCacheTours('test_super', superLargeTours);
if (!localStorage.getItem('test_super')) {
  console.log("Test 3 Passed: Super large data cleared from cache safely.");
}

console.log("--- Tests Completed ---");
