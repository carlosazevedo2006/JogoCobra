import { Position, Snake } from './types';
import { positionsEqual } from './utils';

export const checkWallCollision = (pos: Position, gridSize: number): boolean => {
  return pos.x < 0 || pos.x >= gridSize || pos.y < 0 || pos.y >= gridSize;
};

export const checkSelfCollision = (head: Position, body: Position[]): boolean => {
  return body.some(segment => positionsEqual(segment, head));
};

export const checkSnakeCollision = (snake1: Snake, snake2: Snake): boolean => {
  const head1 = snake1.body[0];
  return snake2.body.some(segment => positionsEqual(segment, head1));
};