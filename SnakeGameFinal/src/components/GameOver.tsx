import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart }) => {
  const isNewHighScore = score === highScore && score > 0;

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.title}>Fim de Jogo!</Text>
        <Text style={styles.scoreText}>
          Sua pontuação: <Text style={styles.scoreValue}>{score}</Text>
        </Text>
        {isNewHighScore && (
          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreText}>🎉 Novo Recorde! 🎉</Text>
          </View>
        )}
        <Text style={styles.highScoreText}>Melhor: {highScore}</Text>
        <TouchableOpacity style={styles.button} onPress={onRestart}>
          <Text style={styles.buttonText}>Jogar Novamente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
    width: Dimensions.get('window').width * 0.8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
  },
  scoreValue: {
    fontWeight: 'bold',
    color: '#4CAF50',
    fontSize: 24,
  },
  highScoreContainer: {
    marginVertical: 15,
    padding: 12,
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD600',
  },
  highScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameOver;