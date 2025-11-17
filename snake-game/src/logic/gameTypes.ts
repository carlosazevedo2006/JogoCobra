export type Position = { x: number; y: number };

export enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

export interface GameState {
  snake: Position[];
  direction: Direction;
  food: Position;
  score: number;
  best: number;
  boardSize: number;
  isGameOver: boolean;
}
