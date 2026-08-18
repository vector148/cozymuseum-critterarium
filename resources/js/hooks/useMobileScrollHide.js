import { useEffect, useState } from "react";

export function useMobileScrollHide(sidebarOpen = false) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    if (sidebarOpen) setHidden(false);

    function update() {
      const currentY = window.scrollY;

      if (window.innerWidth > 768 || sidebarOpen || currentY <= 120) {
        setHidden(false);
      } else if (currentY > lastY) {
        setHidden(true);
      } else if (currentY < lastY) {
        setHidden(false);
      }

      lastY = currentY;
      ticking = false;
    }

    function handleScroll() {
      if (ticking) return;
      window.requestAnimationFrame(update);
      ticking = true;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sidebarOpen]);

  return hidden;
}
