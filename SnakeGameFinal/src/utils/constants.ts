import { GameConfig } from '../types/gameTypes';

export const DEFAULT_CONFIG: GameConfig = {
  boardSize: 10,
  initialSpeed: 300,        // Mais lento para pensar
  speedIncrement: 5,        // Aumento mais gradual
  snakeColor: '#4CAF50',
  foodColor: '#F44336'
};

export const INITIAL_SNAKE: [number, number][] = [[5, 5]];
export const INITIAL_DIRECTION = 'DIREITA';