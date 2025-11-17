import { useState, useCallback } from 'react';
import { Direction } from '../types/gameTypes';
import { getOppositeDirection } from '../utils/gameHelpers';

export const useSnakeMovement = (initialDirection: Direction) => {
  const [direction, setDirection] = useState<Direction>(initialDirection);
  const [nextDirection, setNextDirection] = useState<Direction>(initialDirection);

  const changeDirection = useCallback((newDirection: Direction) => {
    if (newDirection !== getOppositeDirection(direction)) {
      setNextDirection(newDirection);
    }
  }, [direction]);

  const updateDirection = useCallback(() => {
    setDirection(nextDirection);
  }, [nextDirection]);

  const resetDirection = useCallback((newDirection: Direction) => {
    setDirection(newDirection);
    setNextDirection(newDirection);
  }, []);

  return {
    direction,
    nextDirection,
    changeDirection,
    updateDirection,
    resetDirection
  };
};