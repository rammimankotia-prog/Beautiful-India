import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A utility component that scrolls to an element matching the URL hash.
 * This is useful for sidebar navigation on long pages like Privacy Policy.
 */
const ScrollToAnchor = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        // Use setTimeout to ensure the element is rendered and measurable
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      // Scroll to top on route change if no hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
};

export default ScrollToAnchor;
