import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameContext } from '../context/GameContext';
import TurnIndicator from '../components/TurnIndicator';

export default function GameScreen() {
  const { gameState } = useGameContext();

  const currentPlayer = gameState.players.find(
    p => p.id === gameState.currentTurnPlayerId
  );

  return (
    <View style={styles.container}>
      <TurnIndicator playerName={currentPlayer?.name ?? ''} />
      <Text>Tabuleiro do jogo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
