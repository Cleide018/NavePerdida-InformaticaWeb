export interface Position {
  x: number;
  y: number;
}

export interface Player extends Position {
  width: number;
  height: number;
}

export interface Bullet extends Position {
  width: number;
  height: number;
  speed: number;
}

export interface Enemy extends Position {
  width: number;
  height: number;
  speed: number;
  type: 'fast' | 'slow' | 'normal';
}

export interface Star extends Position {
  size: number;
  speed: number;
  opacity: number;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';
