import { Position, Direction } from './types';
import { OPPOSITE_DIRECTIONS, DIRECTION_MOVES } from './constants';

export const getOppositeDirection = (dir: Direction): Direction => {
  return OPPOSITE_DIRECTIONS[dir];
};

export const getNextPosition = (pos: Position, dir: Direction): Position => {
  const move = DIRECTION_MOVES[dir];
  return {
    x: pos.x + move.x,
    y: pos.y + move.y
  };
};

export const positionsEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

export const positionToString = (pos: Position): string => {
  return `${pos.x},${pos.y}`;
};