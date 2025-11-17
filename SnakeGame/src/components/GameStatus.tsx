import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GameStatusProps {
  score: number;      // Pontuação atual
  highScore: number;  // Melhor pontuação
  speed: number;      // Velocidade atual (intervalo em ms)
}

/**
 * Componente que exibe informações do jogo: pontuação, recorde, velocidade
 */
const GameStatus: React.FC<GameStatusProps> = ({ 
  score, 
  highScore, 
  speed 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snake Game</Text>
      <View style={styles.statsContainer}>
        {/* Pontuação atual */}
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Score:</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        
        {/* Recorde pessoal */}
        <View style={styles.stat}>
          <Text style={styles.statLabel}>High Score:</Text>
          <Text style={styles.statValue}>{highScore}</Text>
        </View>
        
        {/* Velocidade (convertida para valor mais amigável) */}
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Speed:</Text>
          <Text style={styles.statValue}>
            {Math.round((200 - speed) / 2)} {/* Converte para escala 0-100 */}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Estilos usando StyleSheet do React Native
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',          // Centraliza horizontalmente
    marginBottom: 20,              // Espaço abaixo do componente
  },
  title: {
    fontSize: 24,                  // Tamanho grande para título
    fontWeight: 'bold',            // Negrito
    marginBottom: 10,              // Espaço abaixo do título
    color: '#333',                 // Cor escura para contraste
  },
  statsContainer: {
    flexDirection: 'row',          // Itens em linha horizontal
    justifyContent: 'space-around', // Espaço igual entre itens
    width: '100%',                 // Ocupa largura total
  },
  stat: {
    alignItems: 'center',          // Centraliza label e valor
  },
  statLabel: {
    fontSize: 14,                  // Tamanho menor para labels
    color: '#666',                 // Cor mais suave
    marginBottom: 4,               // Espaço entre label e valor
  },
  statValue: {
    fontSize: 18,                  // Tamanho maior para valores
    fontWeight: 'bold',            // Negrito para destaque
    color: '#333',                 // Cor escura
  },
});

export default GameStatus;