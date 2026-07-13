import { useEffect, useRef } from 'react';

export function useParallaxScroll(speed = 0.2) {
  const ref = useRef(null);

  useEffect(() => {
    // Disable translation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            // Apply standard translation offset
            const scrollY = window.scrollY;
            ref.current.style.transform = `translateY(${scrollY * speed}px)`;
            ref.current.style.willChange = 'transform';
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [speed]);

  return ref;
}
