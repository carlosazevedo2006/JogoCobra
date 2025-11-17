import { GameConfig } from '../types/gameTypes';

export const DEFAULT_CONFIG: GameConfig = {
  boardSize: 10,
  initialSpeed: 200,
  speedIncrement: 10,
  snakeColor: '#4CAF50',
  foodColor: '#F44336'
};

export const INITIAL_SNAKE: [number, number][] = [[5, 5]];
export const INITIAL_DIRECTION = 'RIGHT';