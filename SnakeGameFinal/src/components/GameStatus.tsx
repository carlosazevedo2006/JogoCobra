import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GameStatusProps {
  score: number;
  highScore: number;
  speed: number;
}

const GameStatus: React.FC<GameStatusProps> = ({ score, highScore, speed }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐍 Snake Game</Text>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Score:</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>High Score:</Text>
          <Text style={styles.statValue}>{highScore}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Speed:</Text>
          <Text style={styles.statValue}>{Math.round((200 - speed) / 2)}</Text>
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