import { Pause, Play, Home } from 'lucide-react';

interface PauseScreenProps {
  onResume: () => void;
  onMenu: () => void;
}

export const PauseScreen = ({ onResume, onMenu }: PauseScreenProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/80 backdrop-blur-sm">
      <div className="text-center space-y-6 game-panel p-8">
        <div className="space-y-2">
          <Pause size={48} className="mx-auto text-primary" />
          <h2 className="game-title text-2xl text-primary">PAUSADO</h2>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={onResume} className="game-button flex items-center justify-center gap-2">
            <Play size={20} />
            Continuar
          </button>
          <button 
            onClick={onMenu} 
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home size={18} />
            Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
};
