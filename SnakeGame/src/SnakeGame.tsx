import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, BackHandler, Alert, Text } from 'react-native';
import { useGameLogic } from './hooks/useGameLogic';
import { useGameInterval } from './hooks/useGameInterval';
import GameBoard from './components/GameBoard';
import GameStatus from './components/GameStatus';
import Controls from './components/Controls';
import GameOver from './components/GameOver';
import { Direction } from './types/gameTypes';

const SnakeGame: React.FC = () => {
  const {
    gameState,
    moveSnake,
    startGame,
    pauseGame,
    changeDirection,
    config
  } = useGameLogic();

  useGameInterval(moveSnake, gameState.status === 'PLAYING' ? gameState.speed : null);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const keyDirectionMap: Record<string, Direction> = {
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT',
      'KeyW': 'UP',
      'KeyS': 'DOWN',
      'KeyA': 'LEFT',
      'KeyD': 'RIGHT'
    };

    const newDirection = keyDirectionMap[e.code];
    if (newDirection) {
      changeDirection(newDirection);
    }

    if (e.code === 'Space') {
      e.preventDefault();
      pauseGame();
    }

    if (e.code === 'KeyR') {
      startGame();
    }
  }, [changeDirection, pauseGame, startGame]);

  const handleBackPress = useCallback(() => {
    if (gameState.status === 'PLAYING') {
      Alert.alert(
        'Sair do Jogo',
        'Tem certeza que deseja sair? Seu progresso será perdido.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: () => BackHandler.exitApp(),
          },
        ]
      );
      return true;
    }
    return false;
  }, [gameState.status]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyPress);
      }
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleKeyPress, handleBackPress]);

  return (
    <View style={styles.container}>
      <GameStatus 
        score={gameState.score}
        highScore={gameState.highScore}
        speed={gameState.speed}
      />
      
      <GameBoard
        boardSize={config.boardSize}
        snake={gameState.snake}
        food={gameState.food}
        snakeColor={config.snakeColor}
        foodColor={config.foodColor}
      />
      
      <Controls
        onDirectionChange={changeDirection}
        onPause={pauseGame}
        onRestart={startGame}
        isPlaying={gameState.status === 'PLAYING'}
      />

      {gameState.status === 'GAME_OVER' && (
        <GameOver
          score={gameState.score}
          highScore={gameState.highScore}
          onRestart={startGame}
        />
      )}

      {gameState.status === 'PAUSED' && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseContent}>
            <Text style={styles.pauseText}>Jogo Pausado</Text>
            <Text style={styles.pauseSubtext}>
              Toque em "Resume" para continuar
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 500,
  },
  pauseContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  pauseSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SnakeGame;