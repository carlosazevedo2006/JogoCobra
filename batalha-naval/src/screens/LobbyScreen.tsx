import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { useGameContext } from '../context/GameContext';

export default function LobbyScreen() {
  const { createPlayers } = useGameContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Batalha Naval</Text>

      <Button
        title="Iniciar Jogo"
        onPress={() => createPlayers('Jogador 1', 'Jogador 2')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
});
