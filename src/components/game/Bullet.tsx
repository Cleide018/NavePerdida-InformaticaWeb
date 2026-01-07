import { Bullet as BulletType } from '@/types/game';

interface BulletProps {
  bullet: BulletType;
}

export const Bullet = ({ bullet }: BulletProps) => {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: bullet.x,
        top: bullet.y,
        width: bullet.width,
        height: bullet.height,
        background: 'linear-gradient(180deg, hsl(45 100% 70%) 0%, hsl(45 100% 50%) 100%)',
        boxShadow: '0 0 10px hsl(45 100% 60%), 0 0 20px hsl(45 100% 50%)',
      }}
    />
  );
};
