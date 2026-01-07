import { useEffect, useState } from 'react';

interface ExplosionProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export const Explosion = ({ x, y, onComplete }: ExplosionProps) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => {
        if (prev >= 5) {
          clearInterval(interval);
          onComplete();
          return prev;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  const particles = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const distance = frame * 8;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      scale: 1 - frame * 0.15,
      opacity: 1 - frame * 0.18,
    };
  });

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale})`,
            opacity: particle.opacity,
            background: i % 2 === 0 
              ? 'hsl(45 100% 60%)' 
              : 'hsl(15 90% 55%)',
            boxShadow: `0 0 10px ${i % 2 === 0 ? 'hsl(45 100% 60%)' : 'hsl(15 90% 55%)'}`,
          }}
        />
      ))}
      <div
        className="absolute w-6 h-6 rounded-full -translate-x-3 -translate-y-3"
        style={{
          background: 'radial-gradient(circle, hsl(45 100% 80%) 0%, transparent 70%)',
          opacity: 1 - frame * 0.2,
          transform: `scale(${1 + frame * 0.5})`,
        }}
      />
    </div>
  );
};
