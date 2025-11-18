import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions,
} from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';

// Importações ATUALIZADAS
import { GameConfig, Snake, Position, Direction, GameState } from './game/types';
import { DEFAULT_CONFIG } from './game/constants';
import { changeDirection } from './game/snakeMovement';
import { generateFood } from './game/foodGenerator';
import { processPlayerMove, processAIMove, checkGameOver } from './game/gameEngine';
import { loadHighScore, saveHighScore } from './game/scoreManager';
import { Board } from './components/Board';
import { SettingsPanel } from './components/SettingsPanel';
import { styles } from './styles/styles';

export default function SnakeGame() {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [showSettings, setShowSettings] = useState(false);
  const [gameState, setGameState] = useState<GameState>('menu');
  
  const [playerSnake, setPlayerSnake] = useState<Snake>({
    body: [{ x: 5, y: 5 }],
    direction: 'RIGHT',
    color: config.snakeColor,
    isPlayer: true
  });

  const [aiSnake, setAiSnake] = useState<Snake>({
    body: [{ x: 2, y: 2 }],
    direction: 'DOWN',
    color: '#ef4444',
    isPlayer: false
  });

  const [food, setFood] = useState<Position>({ x: 7, y: 7 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(config.initialSpeed);
  const [foodEffect, setFoodEffect] = useState<Position | null>(null);

  const gameLoopRef = useRef<any>(null);

  // Carregar high score
  useEffect(() => {
    loadHighScore().then(setHighScore);
  }, []);

  // Atualizar cor da cobra
  useEffect(() => {
    setPlayerSnake(prev => ({ ...prev, color: config.snakeColor }));
  }, [config.snakeColor]);

  // Atualizar high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      saveHighScore(score);
    }
  }, [score, highScore]);

  // Gestos de deslizar
  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      if (gameState !== 'playing') return;

      const { translationX, translationY } = event;
      const threshold = 30;

      let newDir: Direction | null = null;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        newDir = translationX > threshold ? 'RIGHT' : translationX < -threshold ? 'LEFT' : null;
      } else {
        newDir = translationY > threshold ? 'DOWN' : translationY < -threshold ? 'UP' : null;
      }

      if (newDir) {
        setPlayerSnake(prev => changeDirection(prev, newDir as Direction));
      }
    });

  // Loop principal do jogo
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    setPlayerSnake(prevPlayer => {
      setAiSnake(prevAi => {
        const { newPlayer, ateFood, collision } = processPlayerMove(
          prevPlayer,
          food,
          config.gridSize
        );

        if (collision) {
          setGameState('gameover');
          return prevPlayer;
        }

        if (ateFood) {
          setScore(s => s + 1);
          setFoodEffect(food);
          setTimeout(() => setFoodEffect(null), 300);
          
          const newAiBeforeFood = processAIMove(prevAi, food, config.gridSize);
          setFood(generateFood(config.gridSize, [newPlayer, newAiBeforeFood]));
          
          if (config.speedIncrease) {
            setSpeed(s => Math.max(50, s - 5));
          }
        }

        const newAi = processAIMove(prevAi, food, config.gridSize);

        if (checkGameOver(newPlayer, newAi)) {
          setGameState('gameover');
        }

        setAiSnake(newAi);
        return newPlayer;
      });
      return prevPlayer;
    });
  }, [gameState, food, config]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, speed);
      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [gameState, gameLoop, speed]);

  const startGame = () => {
    const initialPlayerPos = { 
      x: Math.floor(config.gridSize / 2), 
      y: Math.floor(config.gridSize / 2) 
    };
    const initialAiPos = { x: 2, y: 2 };
    
    const newPlayerSnake: Snake = {
      body: [initialPlayerPos],
      direction: 'RIGHT',
      color: config.snakeColor,
      isPlayer: true
    };

    const newAiSnake: Snake = {
      body: [initialAiPos],
      direction: 'DOWN',
      color: '#ef4444',
      isPlayer: false
    };

    setPlayerSnake(newPlayerSnake);
    setAiSnake(newAiSnake);
    setFood(generateFood(config.gridSize, [newPlayerSnake, newAiSnake]));
    setScore(0);
    setSpeed(config.initialSpeed);
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setGameState('menu');
  };

  const handleDirectionPress = (dir: Direction) => {
    if (gameState === 'playing') {
      setPlayerSnake(prev => changeDirection(prev, dir));
    }
  };

  if (showSettings) {
    return (
      <SettingsPanel
        config={config}
        onConfigChange={setConfig}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.gameContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>🐍 JOGO DA COBRA</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Pontuação: <Text style={styles.scoreValue}>{score}</Text></Text>
              <Text style={styles.scoreText}>Recorde: <Text style={styles.highScoreValue}>{highScore}</Text></Text>
            </View>
          </View>

          {gameState === 'menu' && (
            <View style={styles.menuContainer}>
              <Text style={styles.menuTitle}>Bem-vindo!</Text>
              <Text style={styles.menuText}>Deslize na tela ou use os botões para controlar a cobra.</Text>
              <Text style={styles.warningText}>⚠️ Cuidado com a cobra vermelha (IA)!</Text>
              
              <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>▶ Iniciar Jogo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettings(true)}>
                <Text style={styles.settingsButtonText}>⚙️ Configurações</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameState === 'gameover' && (
            <View style={styles.gameoverContainer}>
              <Text style={styles.gameoverTitle}>Game Over!</Text>
              <Text style={styles.finalScore}>Pontuação Final: <Text style={styles.finalScoreValue}>{score}</Text></Text>
              {score === highScore && score > 0 && (
                <Text style={styles.newRecord}>🏆 Novo Recorde!</Text>
              )}
              
              <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
                <Text style={styles.restartButtonText}>🔄 Jogar Novamente</Text>
              </TouchableOpacity>
            </View>
          )}

          {(gameState === 'playing' || gameState === 'paused') && (
            <>
              <Board
                gridSize={config.gridSize}
                boardColor={config.boardColor}
                playerSnake={playerSnake}
                aiSnake={aiSnake}
                food={food}
                foodEffect={foodEffect}
              />

              {gameState === 'paused' && (
                <Text style={styles.pausedText}>⏸️ PAUSADO</Text>
              )}

              <View style={styles.controls}>
                <View style={styles.controlRow}>
                  <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionPress('UP')}>
                    <Text style={styles.controlButtonText}>▲</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.controlRow}>
                  <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionPress('LEFT')}>
                    <Text style={styles.controlButtonText}>◀</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.pauseButton} onPress={togglePause}>
                    <Text style={styles.pauseButtonText}>{gameState === 'playing' ? '⏸' : '▶'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionPress('RIGHT')}>
                    <Text style={styles.controlButtonText}>▶</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.controlRow}>
                  <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionPress('DOWN')}>
                    <Text style={styles.controlButtonText}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                  <Text style={styles.resetButtonText}>🔄 Reiniciar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsSmallButton} onPress={() => setShowSettings(true)}>
                  <Text style={styles.settingsSmallButtonText}>⚙️</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.helpText}>🟢 Você | 🔴 IA</Text>
            </>
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}