import { Heart } from 'lucide-react';

interface GameHUDProps {
  score: number;
  lives: number;
  highScore: number;
}

export const GameHUD = ({ score, lives, highScore }: GameHUDProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-10">
      {/* Score */}
      <div className="game-panel px-4 py-2">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pontos</div>
        <div className="score-display text-2xl">{score.toString().padStart(6, '0')}</div>
      </div>

      {/* Lives */}
      <div className="game-panel px-4 py-2 flex items-center gap-2">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mr-2">Vidas</div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              size={24}
              className={`lives-heart transition-all duration-200 ${
                i < lives 
                  ? 'fill-destructive text-destructive' 
                  : 'fill-muted/30 text-muted/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* High Score */}
      <div className="game-panel px-4 py-2">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Recorde</div>
        <div className="text-primary text-lg font-bold">{highScore.toString().padStart(6, '0')}</div>
      </div>
    </div>
  );
};
