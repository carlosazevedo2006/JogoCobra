import { Position, Snake } from './types';
import { positionToString } from './utils';

export const generateFood = (gridSize: number, snakes: Snake[]): Position => {
  const occupied = new Set(
    snakes.flatMap(s => s.body.map(p => positionToString(p)))
  );

  let food: Position;
  let attempts = 0;
  const maxAttempts = gridSize * gridSize;

  do {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
    attempts++;
  } while (occupied.has(positionToString(food)) && attempts < maxAttempts);

  return food;
};