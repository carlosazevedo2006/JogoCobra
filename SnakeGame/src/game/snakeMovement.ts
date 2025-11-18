import { Snake, Direction } from './types';
import { getNextPosition, getOppositeDirection } from './utils';

export const moveSnake = (snake: Snake, grow: boolean): Snake => {
  const head = snake.body[0];
  const newHead = getNextPosition(head, snake.direction);
  const newBody = [newHead, ...snake.body];
  
  if (!grow) {
    newBody.pop();
  }

  return { ...snake, body: newBody };
};

export const changeDirection = (snake: Snake, newDirection: Direction): Snake => {
  if (newDirection === getOppositeDirection(snake.direction)) {
    return snake;
  }
  return { ...snake, direction: newDirection };
};