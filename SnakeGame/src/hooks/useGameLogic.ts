import { useState, useCallback, useEffect } from 'react';
import { GameState, GameStatus, Position, GameConfig } from '../types/gameTypes';
import { useSnakeMovement } from './useSnakeMovement';
import { 
  generateRandomPosition, 
  getNextHeadPosition, 
  checkCollision, 
  checkFoodCollision 
} from '../utils/gameHelpers';
import { DEFAULT_CONFIG, INITIAL_SNAKE, INITIAL_DIRECTION } from '../utils/constants';

export const useGameLogic = (config: Partial<GameConfig> = {}) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: [2, 2],
    direction: INITIAL_DIRECTION,
    status: 'PLAYING',
    score: 0,
    highScore: 0,
    speed: mergedConfig.initialSpeed
  });

  const { direction, nextDirection, changeDirection, updateDirection, resetDirection } = 
    useSnakeMovement(INITIAL_DIRECTION);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('snakeHighScore');
    if (storedHighScore) {
      setGameState(prev => ({ 
        ...prev, 
        highScore: parseInt(storedHighScore),
        food: generateRandomPosition(mergedConfig.boardSize, prev.snake)
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        food: generateRandomPosition(mergedConfig.boardSize, prev.snake)
      }));
    }
  }, [mergedConfig.boardSize]);

  const moveSnake = useCallback(() => {
    updateDirection();
    
    setGameState(prev => {
      if (prev.status !== 'PLAYING') return prev;

      const head = prev.snake[0];
      const newHead = getNextHeadPosition(head, nextDirection);
      const hasEaten = checkFoodCollision(newHead, prev.food);

      if (checkCollision(newHead, mergedConfig.boardSize, prev.snake)) {
        return { ...prev, status: 'GAME_OVER' };
      }

      const newSnake = [newHead, ...prev.snake];
      if (!hasEaten) {
        newSnake.pop();
      }

      let newFood = prev.food;
      let newScore = prev.score;
      let newSpeed = prev.speed;

      if (hasEaten) {
        newFood = generateRandomPosition(mergedConfig.boardSize, newSnake);
        newScore = prev.score + 1;
        newSpeed = Math.max(prev.speed - mergedConfig.speedIncrement, 50);
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        speed: newSpeed,
        direction: nextDirection
      };
    });
  }, [nextDirection, mergedConfig.boardSize, mergedConfig.speedIncrement, updateDirection]);

  const startGame = useCallback(() => {
    const initialSnake = INITIAL_SNAKE;
    const initialFood = generateRandomPosition(mergedConfig.boardSize, initialSnake);
    
    setGameState({
      snake: initialSnake,
      food: initialFood,
      direction: INITIAL_DIRECTION,
      status: 'PLAYING',
      score: 0,
      highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
      speed: mergedConfig.initialSpeed
    });
    
    resetDirection(INITIAL_DIRECTION);
  }, [mergedConfig, resetDirection]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'PLAYING' ? 'PAUSED' : 'PLAYING'
    }));
  }, []);

  useEffect(() => {
    if (gameState.score > gameState.highScore) {
      const newHighScore = gameState.score;
      setGameState(prev => ({ ...prev, highScore: newHighScore }));
      localStorage.setItem('snakeHighScore', newHighScore.toString());
    }
  }, [gameState.score, gameState.highScore]);

  return {
    gameState,
    moveSnake,
    startGame,
    pauseGame,
    changeDirection,
    config: mergedConfig
  };
};