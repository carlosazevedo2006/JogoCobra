import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface GameOverProps {
  score: number;           // Pontuação final do jogo
  highScore: number;       // Recorde atual do jogador
  onRestart: () => void;   // Função callback para reiniciar o jogo
}

/**
 * Componente que exibe a tela de Game Over
 * - Mostra a pontuação alcançada
 * - Indica se foi batido um novo recorde
 * - Oferece botão para jogar novamente
 * - Overlay semi-transparente sobre o jogo
 */
const GameOver: React.FC<GameOverProps> = ({ 
  score, 
  highScore, 
  onRestart 
}) => {
  // Verifica se o jogador atingiu um novo recorde
  const isNewHighScore = score === highScore && score > 0;

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        {/* Título principal */}
        <Text style={styles.title}>Game Over!</Text>
        
        {/* Exibição da pontuação */}
        <Text style={styles.scoreText}>
          Your score: <Text style={styles.scoreValue}>{score}</Text>
        </Text>

        {/* Mensagem especial se for novo recorde */}
        {isNewHighScore && (
          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreText}>
              🎉 New High Score! 🎉
            </Text>
          </View>
        )}

        {/* Exibição do recorde atual */}
        <Text style={styles.highScoreText}>
          Best: {highScore}
        </Text>

        {/* Botão para jogar novamente */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={onRestart}
          accessibilityLabel="Jogar novamente"
          accessibilityHint="Inicia um novo jogo de Snake"
          activeOpacity={0.7} // Feedback visual ao tocar
        >
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    /**
     * OVERLAY QUE COBRE TODA A TELA:
     * - position: 'absolute' para sobrepor outros componentes
     * - top, left, right, bottom: 0 para cobrir toda a área
     * - backgroundColor: preto semi-transparente
     * - zIndex: alto para ficar acima de tudo
     */
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Preto com 85% de opacidade
    justifyContent: 'center',    // Centraliza verticalmente
    alignItems: 'center',        // Centraliza horizontalmente
    zIndex: 1000,                // Garante que fique acima de outros elementos
  },
  content: {
    /**
     * CONTEÚDO PRINCIPAL DO MODAL:
     * - backgroundColor: branco para contraste
     * - padding: espaçamento interno generoso
     * - borderRadius: cantos arredondados
     * - alignItems: centraliza o conteúdo
     * - margin: margem para não encostar nas bordas da tela
     * - shadow: efeito de elevação
     */
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
    width: Dimensions.get('window').width * 0.8, // 80% da largura da tela
    // Sombra para efeito de profundidade
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10, // Sombra no Android
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  scoreValue: {
    fontWeight: 'bold',
    color: '#4CAF50', // Verde para destacar a pontuação
    fontSize: 24,
  },
  highScoreContainer: {
    marginVertical: 15,
    padding: 12,
    backgroundColor: '#FFF9C4', // Amarelo claro de destaque
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD600', // Amarelo mais forte na borda
  },
  highScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800', // Laranja
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50', // Verde
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 25,
    // Sombra para o botão
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // Transição suave para hover (web)
    transition: 'all 0.2s ease-in-out',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameOver;

/**
 * ANIMAÇÕES SUGERIDAS (PARA IMPLEMENTAR FUTURAMENTE):
 * 
 * 1. ENTRADA COM FADE:
 *    const fadeAnim = useRef(new Animated.Value(0)).current;
 *    useEffect(() => {
 *      Animated.timing(fadeAnim, {
 *        toValue: 1,
 *        duration: 500,
 *        useNativeDriver: true,
 *      }).start();
 *    }, []);
 * 
 * 2. ANIMAÇÃO DE ESCALA:
 *    const scaleAnim = useRef(new Animated.Value(0.8)).current;
 *    Animated.spring(scaleAnim, {
 *      toValue: 1,
 *      friction: 8,
 *      useNativeDriver: true,
 *    }).start();
 */