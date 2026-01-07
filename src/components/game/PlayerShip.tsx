import { Player } from '@/types/game';

interface PlayerShipProps {
  player: Player;
}

export const PlayerShip = ({ player }: PlayerShipProps) => {
  return (
    <div
      className="absolute transition-transform duration-75"
      style={{
        left: player.x,
        top: player.y,
        width: player.width,
        height: player.height,
      }}
    >
      <svg
        viewBox="0 0 40 50"
        className="w-full h-full animate-pulse-glow"
        style={{ filter: 'drop-shadow(0 0 10px hsl(180 100% 50%))' }}
      >
        {/* Ship body */}
        <polygon
          points="20,0 5,40 20,35 35,40"
          fill="url(#playerGradient)"
          stroke="hsl(180 100% 70%)"
          strokeWidth="1"
        />
        {/* Cockpit */}
        <ellipse
          cx="20"
          cy="25"
          rx="6"
          ry="8"
          fill="hsl(200 80% 60%)"
          opacity="0.8"
        />
        {/* Wings */}
        <polygon
          points="5,40 0,50 10,42"
          fill="hsl(180 100% 40%)"
        />
        <polygon
          points="35,40 40,50 30,42"
          fill="hsl(180 100% 40%)"
        />
        {/* Engine glow */}
        <ellipse
          cx="20"
          cy="45"
          rx="5"
          ry="3"
          fill="hsl(45 100% 60%)"
          opacity="0.9"
        >
          <animate
            attributeName="opacity"
            values="0.9;0.5;0.9"
            dur="0.2s"
            repeatCount="indefinite"
          />
        </ellipse>
        <defs>
          <linearGradient id="playerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(180 100% 60%)" />
            <stop offset="100%" stopColor="hsl(180 100% 35%)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
