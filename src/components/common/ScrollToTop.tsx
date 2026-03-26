import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 🌟 IMPROVEMENT: Standardized smooth behavior 
    // This ensures that when a user switches pages, the browser 
    // handles the scroll gracefully rather than an instant jump.
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // Change to "instant" if you prefer no animation
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;