import { Skull, RotateCcw, Trophy } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export const GameOverScreen = ({ score, highScore, isNewHighScore, onRestart, onMenu }: GameOverScreenProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/80 backdrop-blur-sm">
      <div className="text-center space-y-6 game-panel p-8 max-w-md">
        {/* Game Over Title */}
        <div className="space-y-2">
          <Skull size={64} className="mx-auto text-destructive animate-pulse" />
          <h2 className="game-title text-3xl md:text-4xl text-destructive">
            GAME OVER
          </h2>
        </div>

        {/* Score Display */}
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Sua Pontuação</div>
            <div className="score-display text-4xl">{score}</div>
          </div>

          {isNewHighScore && (
            <div className="flex items-center justify-center gap-2 text-accent animate-pulse">
              <Trophy size={24} />
              <span className="font-bold uppercase">Novo Recorde!</span>
              <Trophy size={24} />
            </div>
          )}

          <div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Recorde</div>
            <div className="text-primary text-2xl font-bold">{highScore}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button onClick={onRestart} className="game-button flex items-center justify-center gap-2">
            <RotateCcw size={20} />
            Jogar Novamente
          </button>
          <button 
            onClick={onMenu} 
            className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
};
