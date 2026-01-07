import { Enemy } from '@/types/game';

interface EnemyShipProps {
  enemy: Enemy;
}

export const EnemyShip = ({ enemy }: EnemyShipProps) => {
  const getColors = () => {
    switch (enemy.type) {
      case 'fast':
        return { primary: 'hsl(0 85% 50%)', secondary: 'hsl(0 85% 35%)' };
      case 'slow':
        return { primary: 'hsl(280 70% 50%)', secondary: 'hsl(280 70% 35%)' };
      default:
        return { primary: 'hsl(15 90% 55%)', secondary: 'hsl(15 90% 40%)' };
    }
  };

  const colors = getColors();

  return (
    <div
      className="absolute"
      style={{
        left: enemy.x,
        top: enemy.y,
        width: enemy.width,
        height: enemy.height,
      }}
    >
      <svg
        viewBox="0 0 35 40"
        className="w-full h-full"
        style={{ filter: `drop-shadow(0 0 8px ${colors.primary})` }}
      >
        {/* Enemy body - inverted ship */}
        <polygon
          points="17.5,40 0,10 17.5,18 35,10"
          fill={colors.primary}
          stroke={colors.secondary}
          strokeWidth="1"
        />
        {/* Top dome */}
        <ellipse
          cx="17.5"
          cy="12"
          rx="10"
          ry="12"
          fill={colors.secondary}
        />
        {/* Evil eye */}
        <ellipse
          cx="17.5"
          cy="15"
          rx="4"
          ry="4"
          fill="hsl(45 100% 60%)"
        >
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Side wings */}
        <polygon
          points="0,10 -5,20 5,15"
          fill={colors.secondary}
        />
        <polygon
          points="35,10 40,20 30,15"
          fill={colors.secondary}
        />
      </svg>
    </div>
  );
};
