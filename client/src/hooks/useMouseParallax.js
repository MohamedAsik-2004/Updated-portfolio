import { useEffect, useRef } from 'react';

export function useMouseParallax(factor = 0.05) {
  const ref = useRef(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Disable translation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      // Mouse coordinates relative to middle of display
      targetPos.current = {
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      };
    };

    let animationFrameId;

    const update = () => {
      // Linear interpolation (lerp) for double-buffered smooth tracking
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.08;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.08;

      if (ref.current) {
        const xOffset = currentPos.current.x * factor;
        const yOffset = currentPos.current.y * factor;
        ref.current.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
        ref.current.style.willChange = 'transform';
      }

      animationFrameId = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [factor]);

  return ref;
}
