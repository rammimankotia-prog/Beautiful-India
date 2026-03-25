/**
 * WebMCP Bridge for Bharat Darshan
 * This allows AI agents to interact with the site's functionality programmatically.
 */

(function() {
  const mcp = {
    version: "1.0",
    tools: {
      searchTours: async (params) => {
        console.log("[WebMCP] Searching tours:", params);
        try {
          const res = await fetch(`${window.location.origin}/data/tours.json`);
          const tours = await res.json();
          let results = tours;
          
          if (params.destination) {
            results = results.filter(t => t.destination?.toLowerCase().includes(params.destination.toLowerCase()));
          }
          if (params.theme) {
            results = results.filter(t => t.theme?.toLowerCase().includes(params.theme.toLowerCase()));
          }
          if (params.maxPrice) {
            results = results.filter(t => t.price <= params.maxPrice);
          }
          
          return results.slice(0, 5);
        } catch (e) {
          return { error: "Failed to search tours", details: e.message };
        }
      },
      getTourDetails: async ({ tourId }) => {
        console.log("[WebMCP] Fetching details for tour:", tourId);
        try {
          const res = await fetch(`${window.location.origin}/data/tours.json`);
          const tours = await res.json();
          return tours.find(t => t.id === tourId) || { error: "Tour not found" };
        } catch (e) {
          return { error: "Failed to fetch tour details", details: e.message };
        }
      }
    }
  };

  // Expose to global window object for discovery
  window.mcp = mcp;
  console.log("✅ WebMCP Bridge Initialized. AI agents can now interact via window.mcp");
})();
