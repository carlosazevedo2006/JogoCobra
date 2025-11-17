import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    status: 'JOGANDO',
    score: 0,
    highScore: 0,
    speed: mergedConfig.initialSpeed
  });

  const { direction, nextDirection, changeDirection, updateDirection, resetDirection } = 
    useSnakeMovement(INITIAL_DIRECTION);

  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const storedHighScore = await AsyncStorage.getItem('snakeHighScore');
        if (storedHighScore !== null) {
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
      } catch (error) {
        setGameState(prev => ({
          ...prev,
          food: generateRandomPosition(mergedConfig.boardSize, prev.snake)
        }));
      }
    };

    loadHighScore();
  }, [mergedConfig.boardSize]);

  const moveSnake = useCallback(() => {
    updateDirection();
    
    setGameState(prev => {
      if (prev.status !== 'JOGANDO') return prev;

      const head = prev.snake[0];
      const newHead = getNextHeadPosition(head, nextDirection);
      const hasEaten = checkFoodCollision(newHead, prev.food);

      if (checkCollision(newHead, mergedConfig.boardSize, prev.snake)) {
        return { ...prev, status: 'FIM_DE_JOGO' };
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
        // Velocidade mínima de 100ms (mais tempo para pensar)
        newSpeed = Math.max(prev.speed - mergedConfig.speedIncrement, 100);
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

  const startGame = useCallback(async () => {
    const initialSnake = INITIAL_SNAKE;
    const initialFood = generateRandomPosition(mergedConfig.boardSize, initialSnake);
    
    try {
      const storedHighScore = await AsyncStorage.getItem('snakeHighScore');
      setGameState({
        snake: initialSnake,
        food: initialFood,
        direction: INITIAL_DIRECTION,
        status: 'JOGANDO',
        score: 0,
        highScore: storedHighScore ? parseInt(storedHighScore) : 0,
        speed: mergedConfig.initialSpeed
      });
    } catch (error) {
      setGameState({
        snake: initialSnake,
        food: initialFood,
        direction: INITIAL_DIRECTION,
        status: 'JOGANDO',
        score: 0,
        highScore: 0,
        speed: mergedConfig.initialSpeed
      });
    }
    
    resetDirection(INITIAL_DIRECTION);
  }, [mergedConfig, resetDirection]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'JOGANDO' ? 'PAUSADO' : 'JOGANDO'
    }));
  }, []);

  useEffect(() => {
    const saveHighScore = async () => {
      if (gameState.status === 'FIM_DE_JOGO' && gameState.score > gameState.highScore) {
        try {
          await AsyncStorage.setItem('snakeHighScore', gameState.score.toString());
        } catch (error) {
          // Ignorar erro de salvamento
        }
      }
    };

    saveHighScore();
  }, [gameState.status, gameState.score, gameState.highScore]);

  useEffect(() => {
    if (gameState.score > gameState.highScore) {
      setGameState(prev => ({ ...prev, highScore: gameState.score }));
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