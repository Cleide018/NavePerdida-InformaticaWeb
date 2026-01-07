import { useEffect, useState } from 'react';
import { Star } from '@/types/game';

interface StarFieldProps {
  count?: number;
}

export const StarField = ({ count = 100 }: StarFieldProps) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const initialStars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setStars(initialStars);
  }, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prev =>
        prev.map(star => ({
          ...star,
          y: star.y > 100 ? -2 : star.y + star.speed,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-foreground"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
          }}
        />
      ))}
    </div>
  );
};
