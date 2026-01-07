import { useCallback, useEffect, useRef, useState } from 'react';
import { Player, Enemy, Bullet as BulletType, GameState } from '@/types/game';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useKeyboard } from '@/hooks/useKeyboard';
import { StarField } from './StarField';
import { PlayerShip } from './PlayerShip';
import { EnemyShip } from './EnemyShip';
import { Bullet } from './Bullet';
import { Explosion } from './Explosion';
import { GameHUD } from './GameHUD';
import { MenuScreen } from './MenuScreen';
import { GameOverScreen } from './GameOverScreen';
import { PauseScreen } from './PauseScreen';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 6;
const BULLET_SPEED = 10;
const SHOOT_COOLDOWN = 200;

export const GameCanvas = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const lastShootTime = useRef(0);

  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('navePerdida_highScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const [player, setPlayer] = useState<Player>({
    x: GAME_WIDTH / 2 - 20,
    y: GAME_HEIGHT - 80,
    width: 40,
    height: 50,
  });

  const [bullets, setBullets] = useState<BulletType[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [explosions, setExplosions] = useState<{ id: number; x: number; y: number }[]>([]);
  const [invincible, setInvincible] = useState(false);

  const keys = useKeyboard();

  // Spawn enemies based on score
  const spawnEnemy = useCallback(() => {
    const difficultyMultiplier = 1 + score * 0.02;
    const types: Enemy['type'][] = ['slow', 'normal', 'fast'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const speedMap = {
      slow: 1.5 + difficultyMultiplier * 0.3,
      normal: 2.5 + difficultyMultiplier * 0.4,
      fast: 4 + difficultyMultiplier * 0.5,
    };

    const newEnemy: Enemy = {
      x: Math.random() * (GAME_WIDTH - 35),
      y: -40,
      width: 35,
      height: 40,
      speed: speedMap[type],
      type,
    };

    setEnemies(prev => [...prev, newEnemy]);
  }, [score]);

  // Game loop
  const gameLoop = useCallback((deltaTime: number) => {
    const delta = deltaTime / 16.67; // Normalize to 60fps

    // Player movement
    setPlayer(prev => {
      let newX = prev.x;
      let newY = prev.y;

      if (keys.has('arrowleft') || keys.has('a')) newX -= PLAYER_SPEED * delta;
      if (keys.has('arrowright') || keys.has('d')) newX += PLAYER_SPEED * delta;
      if (keys.has('arrowup') || keys.has('w')) newY -= PLAYER_SPEED * delta;
      if (keys.has('arrowdown') || keys.has('s')) newY += PLAYER_SPEED * delta;

      // Boundaries
      newX = Math.max(0, Math.min(GAME_WIDTH - prev.width, newX));
      newY = Math.max(0, Math.min(GAME_HEIGHT - prev.height, newY));

      return { ...prev, x: newX, y: newY };
    });

    // Shooting
    if (keys.has(' ')) {
      const now = Date.now();
      if (now - lastShootTime.current > SHOOT_COOLDOWN) {
        lastShootTime.current = now;
        setBullets(prev => [
          ...prev,
          {
            x: player.x + player.width / 2 - 3,
            y: player.y,
            width: 6,
            height: 15,
            speed: BULLET_SPEED,
          },
        ]);
      }
    }

    // Update bullets
    setBullets(prev =>
      prev
        .map(bullet => ({ ...bullet, y: bullet.y - bullet.speed * delta }))
        .filter(bullet => bullet.y > -20)
    );

    // Update enemies
    setEnemies(prev =>
      prev
        .map(enemy => ({ ...enemy, y: enemy.y + enemy.speed * delta }))
        .filter(enemy => enemy.y < GAME_HEIGHT + 50)
    );

    // Collision detection: bullets vs enemies
    setBullets(prevBullets => {
      const remainingBullets: BulletType[] = [];

      prevBullets.forEach(bullet => {
        let bulletHit = false;

        setEnemies(prevEnemies => {
          const remainingEnemies: Enemy[] = [];

          prevEnemies.forEach(enemy => {
            const hit =
              bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y;

            if (hit && !bulletHit) {
              bulletHit = true;
              setScore(s => s + 1);
              setExplosions(prev => [
                ...prev,
                { id: Date.now() + Math.random(), x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2 },
              ]);
            } else {
              remainingEnemies.push(enemy);
            }
          });

          return remainingEnemies;
        });

        if (!bulletHit) {
          remainingBullets.push(bullet);
        }
      });

      return remainingBullets;
    });

    // Collision detection: player vs enemies
    if (!invincible) {
      setEnemies(prevEnemies => {
        let playerHit = false;

        const remainingEnemies = prevEnemies.filter(enemy => {
          const hit =
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y;

          if (hit && !playerHit) {
            playerHit = true;
            return false;
          }
          return true;
        });

        if (playerHit) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('gameover');
            }
            return newLives;
          });
          setInvincible(true);
          setTimeout(() => setInvincible(false), 2000);
          setExplosions(prev => [
            ...prev,
            { id: Date.now(), x: player.x + player.width / 2, y: player.y + player.height / 2 },
          ]);
        }

        return remainingEnemies;
      });
    }
  }, [keys, player, invincible, score]);

  useGameLoop(gameLoop, gameState === 'playing');

  // Enemy spawning
  useEffect(() => {
    if (gameState !== 'playing') return;

    const baseInterval = 1500;
    const minInterval = 400;
    const interval = Math.max(minInterval, baseInterval - score * 20);

    const spawner = setInterval(spawnEnemy, interval);
    return () => clearInterval(spawner);
  }, [gameState, score, spawnEnemy]);

  // Pause handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'p' || e.key === 'Escape') && gameState === 'playing') {
        setGameState('paused');
      } else if ((e.key === 'p' || e.key === 'Escape') && gameState === 'paused') {
        setGameState('playing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // High score update
  useEffect(() => {
    if (gameState === 'gameover' && score > highScore) {
      setHighScore(score);
      setIsNewHighScore(true);
      localStorage.setItem('navePerdida_highScore', score.toString());
    }
  }, [gameState, score, highScore]);

  const startGame = () => {
    setPlayer({
      x: GAME_WIDTH / 2 - 20,
      y: GAME_HEIGHT - 80,
      width: 40,
      height: 50,
    });
    setBullets([]);
    setEnemies([]);
    setExplosions([]);
    setScore(0);
    setLives(3);
    setInvincible(false);
    setIsNewHighScore(false);
    setGameState('playing');
  };

  const removeExplosion = (id: number) => {
    setExplosions(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        ref={gameRef}
        className="relative overflow-hidden rounded-xl border-2 border-primary/30"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          background: 'var(--gradient-space)',
          boxShadow: '0 0 50px hsl(var(--primary) / 0.3), inset 0 0 100px hsl(var(--space-dark))',
        }}
      >
        <StarField count={80} />

        {gameState === 'menu' && (
          <MenuScreen onStart={startGame} highScore={highScore} />
        )}

        {(gameState === 'playing' || gameState === 'paused') && (
          <>
            <GameHUD score={score} lives={lives} highScore={highScore} />

            {/* Player */}
            <div style={{ opacity: invincible ? 0.5 : 1 }} className={invincible ? 'animate-pulse' : ''}>
              <PlayerShip player={player} />
            </div>

            {/* Bullets */}
            {bullets.map((bullet, i) => (
              <Bullet key={`bullet-${i}`} bullet={bullet} />
            ))}

            {/* Enemies */}
            {enemies.map((enemy, i) => (
              <EnemyShip key={`enemy-${i}`} enemy={enemy} />
            ))}

            {/* Explosions */}
            {explosions.map(explosion => (
              <Explosion
                key={explosion.id}
                x={explosion.x}
                y={explosion.y}
                onComplete={() => removeExplosion(explosion.id)}
              />
            ))}
          </>
        )}

        {gameState === 'paused' && (
          <PauseScreen
            onResume={() => setGameState('playing')}
            onMenu={() => setGameState('menu')}
          />
        )}

        {gameState === 'gameover' && (
          <GameOverScreen
            score={score}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            onRestart={startGame}
            onMenu={() => setGameState('menu')}
          />
        )}
      </div>
    </div>
  );
};
