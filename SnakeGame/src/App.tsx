import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, BackHandler, Alert } from 'react-native';
import { useGameLogic } from './hooks/useGameLogic';
import { useGameInterval } from './hooks/useGameInterval';
import GameBoard from './components/GameBoard';
import GameStatus from './components/GameStatus';
import Controls from './components/Controls';
import GameOver from './components/GameOver';
import { Direction } from './types/gameTypes';

/**
 * COMPONENTE PRINCIPAL DO JOGO SNAKE
 * 
 * RESPONSABILIDADES:
 * 1. Integrar todos os hooks e componentes
 * 2. Gerenciar o ciclo de vida do jogo
 * 3. Tratar eventos globais (teclado, back button)
 * 4. Coordenar o fluxo de dados entre componentes
 */
const SnakeGame: React.FC = () => {
  /**
   * HOOK PRINCIPAL DA LÓGICA DO JOGO:
   * - gameState: estado completo do jogo
   * - moveSnake: função para avançar o jogo um quadro
   * - startGame: função para iniciar/reiniciar
   * - pauseGame: função para pausar/retomar
   * - changeDirection: função para mudar direção da cobra
   * - config: configurações do jogo
   */
  const {
    gameState,
    moveSnake,
    startGame,
    pauseGame,
    changeDirection,
    config
  } = useGameLogic();

  /**
   * HOOK DO INTERVALO DO JOGO:
   * - Chama moveSnake automaticamente a cada gameState.speed milissegundos
   * - Para automaticamente quando gameState.status não é 'PLAYING'
   * - Otimizado para performance com useRef
   */
  useGameInterval(
    moveSnake, 
    gameState.status === 'PLAYING' ? gameState.speed : null
  );

  /**
   * MANIPULADOR DE EVENTOS DE TECLADO (para web e dispositivos com teclado)
   * 
   * MAPEAMENTO DE TECLAS:
   * - Arrow Keys: direções
   * - WASD: direções alternativas
   * - Space: pausa/retoma
   * - R: reinicia
   * 
   * @param e Evento de tecla pressionada
   */
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Mapeamento de teclas para direções
    const keyDirectionMap: Record<string, Direction> = {
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT',
      'KeyW': 'UP',       // Tecla W
      'KeyS': 'DOWN',     // Tecla S
      'KeyA': 'LEFT',     // Tecla A
      'KeyD': 'RIGHT'     // Tecla D
    };

    // Obtém a direção correspondente à tecla pressionada
    const newDirection = keyDirectionMap[e.code];
    
    // Se for uma tecla de direção válida, muda a direção
    if (newDirection) {
      changeDirection(newDirection);
    }

    // Tecla Espaço: pausa/retoma o jogo
    if (e.code === 'Space') {
      e.preventDefault(); // Evita que a página role
      pauseGame();
    }

    // Tecla R: reinicia o jogo
    if (e.code === 'KeyR') {
      startGame();
    }
  }, [changeDirection, pauseGame, startGame]);

  /**
   * MANIPULADOR DO BOTÃO VOLTAR (Android)
   * - Mostra confirmação antes de sair do jogo
   * - Só ativo durante o jogo para não interferir com navegação normal
   */
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
      return true; // Indica que o evento foi tratado
    }
    return false; // Permite o comportamento padrão
  }, [gameState.status]);

  /**
   * EFEITO PARA CONFIGURAR EVENT LISTENERS
   * - Teclado: para controles na web
   * - BackHandler: para botão voltar no Android
   */
  useEffect(() => {
    // Adiciona listener para teclado (apenas no ambiente web)
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
    }

    // Adiciona listener para botão voltar (Android)
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // FUNÇÃO DE CLEANUP: remove os listeners quando o componente desmonta
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyPress);
      }
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleKeyPress, handleBackPress]);

  return (
    <View style={styles.container}>
      {/* COMPONENTE DE STATUS: mostra pontuação e recorde */}
      <GameStatus 
        score={gameState.score}
        highScore={gameState.highScore}
        speed={gameState.speed}
      />
      
      {/* TABULEIRO DO JOGO: renderiza cobra e comida */}
      <GameBoard
        boardSize={config.boardSize}
        snake={gameState.snake}
        food={gameState.food}
        snakeColor={config.snakeColor}
        foodColor={config.foodColor}
      />
      
      {/* CONTROLES: botões e área de gestos */}
      <Controls
        onDirectionChange={changeDirection}
        onPause={pauseGame}
        onRestart={startGame}
        isPlaying={gameState.status === 'PLAYING'}
      />

      {/* TELA DE GAME OVER: aparece quando o jogo termina */}
      {gameState.status === 'GAME_OVER' && (
        <GameOver
          score={gameState.score}
          highScore={gameState.highScore}
          onRestart={startGame}
        />
      )}

      {/* INDICADOR DE PAUSA: aparece quando o jogo está pausado */}
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
    flex: 1,                    // Ocupa toda a tela disponível
    padding: 20,                // Espaço interno
    backgroundColor: '#f0f0f0', // Cor de fundo neutra
    justifyContent: 'space-between', // Distribui espaço entre componentes
  },
  pauseOverlay: {
    // Overlay para estado de pausa (similar ao game over)
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 500, // Abaixo do game over mas acima do jogo
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