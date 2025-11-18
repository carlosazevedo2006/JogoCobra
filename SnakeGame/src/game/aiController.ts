import { Snake, Position, Direction } from './types';
import { getNextPosition, getOppositeDirection } from './utils';
import { checkWallCollision, checkSelfCollision } from './collision';

const calculateFreeSpace = (pos: Position, snake: Snake, gridSize: number): number => {
  const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  let freeCount = 0;

  for (const dir of directions) {
    const checkPos = getNextPosition(pos, dir);
    if (!checkWallCollision(checkPos, gridSize) &&
        !checkSelfCollision(checkPos, snake.body)) {
      freeCount++;
    }
  }

  return freeCount * 2;
};

export const getNextDirection = (snake: Snake, food: Position, gridSize: number): Direction => {
  const head = snake.body[0];
  const possibleDirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const opposite = getOppositeDirection(snake.direction);
  
  const validDirs = possibleDirs.filter(dir => dir !== opposite);
  
  const directionScores = validDirs.map(dir => {
    const nextPos = getNextPosition(head, dir);
    
    if (checkWallCollision(nextPos, gridSize)) {
      return { dir, score: -1000 };
    }
    if (checkSelfCollision(nextPos, snake.body.slice(1))) {
      return { dir, score: -1000 };
    }
    
    const dist = Math.abs(nextPos.x - food.x) + Math.abs(nextPos.y - food.y);
    const freeSpaceBonus = calculateFreeSpace(nextPos, snake, gridSize);
    
    return { dir, score: -dist + freeSpaceBonus };
  });

  directionScores.sort((a, b) => b.score - a.score);
  
  return directionScores[0].score > -1000 
    ? directionScores[0].dir 
    : snake.direction;
};