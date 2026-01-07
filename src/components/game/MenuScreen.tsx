import { Rocket, Gamepad2 } from 'lucide-react';

interface MenuScreenProps {
  onStart: () => void;
  highScore: number;
}

export const MenuScreen = ({ onStart, highScore }: MenuScreenProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
      <div className="text-center space-y-8">
        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Rocket size={48} className="text-primary animate-float" />
            <h1 className="game-title text-4xl md:text-6xl text-primary">
              NAVE PERDIDA
            </h1>
            <Rocket size={48} className="text-primary animate-float" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="game-subtitle text-lg text-muted-foreground max-w-md mx-auto">
            Sua nave se perdeu no espaço. Destrua inimigos e sobreviva!
          </p>
        </div>

        {/* High Score */}
        {highScore > 0 && (
          <div className="game-panel inline-block px-6 py-3">
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Recorde</div>
            <div className="score-display text-3xl">{highScore}</div>
          </div>
        )}

        {/* Start Button */}
        <button onClick={onStart} className="game-button flex items-center gap-3 mx-auto">
          <Gamepad2 size={24} />
          Iniciar Jogo
        </button>

        {/* Controls */}
        <div className="game-panel p-6 max-w-sm mx-auto">
          <h3 className="text-primary font-bold mb-4 uppercase tracking-wider">Controles</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Mover:</span>
              <span className="text-foreground">↑ ↓ ← → ou WASD</span>
            </div>
            <div className="flex justify-between">
              <span>Atirar:</span>
              <span className="text-foreground">ESPAÇO</span>
            </div>
            <div className="flex justify-between">
              <span>Pausar:</span>
              <span className="text-foreground">P ou ESC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
