import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { useGameContext } from '../context/GameContext';

export default function SetupScreen() {
  const { gameState, placeShipsRandomly, setPlayerReady } = useGameContext();

  const currentPlayer = gameState.players[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Preparação – {currentPlayer?.name}
      </Text>

      <Button title="Colocação Aleatória" onPress={placeShipsRandomly} />
      <Button
        title="Pronto"
        onPress={() => setPlayerReady(currentPlayer.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});
