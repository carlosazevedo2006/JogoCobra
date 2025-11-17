import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GameStatusProps {
  score: number;
  highScore: number;
  speed: number;
}

const GameStatus: React.FC<GameStatusProps> = ({ score, highScore, speed }) => {
  // Velocidade mais intuitiva: número maior = mais rápido
  const displaySpeed = Math.round((300 - speed) / 10);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐍 Jogo da Cobrinha</Text>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Pontuação:</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Recorde:</Text>
          <Text style={styles.statValue}>{highScore}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Velocidade:</Text>
          <Text style={styles.statValue}>{displaySpeed}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default GameStatus;