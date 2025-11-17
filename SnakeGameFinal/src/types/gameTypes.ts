export type Position = [number, number];
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'PLAYING' | 'GAME_OVER' | 'PAUSED';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  status: GameStatus;
  score: number;
  highScore: number;
  speed: number;
}

export interface GameConfig {
  boardSize: number;
  initialSpeed: number;
  speedIncrement: number;
  snakeColor: string;
  foodColor: string;
}