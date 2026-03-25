import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to `end` over `duration` ms.
 * Returns the current animated value.
 */
export function useCountUp(end, duration = 2000, delay = 0) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);
  const animationFrame = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startTime.current) startTime.current = timestamp;
        const progress = Math.min((timestamp - startTime.current) / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));

        if (progress < 1) {
          animationFrame.current = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [end, duration, delay]);

  return count;
}
