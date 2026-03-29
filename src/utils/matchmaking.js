/**
 * Intelligent Tour Matchmaking Engine
 * Scores and ranks tours based on user preferences.
 */

export const calculateTourMatches = (userPreferences, tours) => {
  if (!tours || !Array.isArray(tours)) return [];

  const {
    userInterest = '',
    budget = 'Standard',
    travelers = '2',
    duration = 'Mid',
    difficulty = 'Moderate'
  } = userPreferences;

  return tours.map(tour => {
    let score = 0;

    // 1. Interest/Theme Match (40% Weight)
    const tourCategory = (tour.nature || tour.theme || '').toLowerCase();
    const tourTitle = (tour.title || '').toLowerCase();
    if (tourCategory.includes(userInterest.toLowerCase()) || 
        userInterest.toLowerCase().includes(tourCategory) ||
        tourTitle.includes(userInterest.toLowerCase())) {
      score += 40;
    }

    // 2. Budget Match (30% Weight)
    const price = tour.price || (tour.pricing?.perPerson) || 0;
    if (budget === 'Luxury' && price > 100000) score += 30;
    else if (budget === 'Premium' && price > 50000 && price <= 100000) score += 30;
    else if (budget === 'Standard' && price <= 50000) score += 30;
    else if (budget === 'Luxury' && price > 50000) score += 20; // Partial match

    // 3. Duration Match (20% Weight)
    const tourDurationStr = tour.duration || '';
    const days = parseInt(tourDurationStr) || 0;
    if (duration === 'Short' && days <= 4) score += 20;
    else if (duration === 'Mid' && days > 4 && days <= 10) score += 20;
    else if (duration === 'Long' && days > 10) score += 20;

    // 4. Difficulty/Type Match (10% Weight)
    if (tour.difficulty?.toLowerCase() === difficulty.toLowerCase()) score += 10;

    return {
      ...tour,
      matchScore: score
    };
  })
  .filter(tour => tour.matchScore > 10) // Only show relevant matches
  .sort((a, b) => b.matchScore - a.matchScore); // Rank by descending score
};
