import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components/Button';
import { useGameContext } from '../context/GameContext';

export function ResultScreen() {
  const { gameState, resetGame } = useGameContext();

  const winner = gameState.players.find(
    p => p.id === gameState.winnerId
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fim de Jogo</Text>

      <Text style={styles.result}>
        {winner ? `Vencedor: ${winner.name}` : 'Sem vencedor'}
      </Text>

      <Button title="Nova Partida" onPress={resetGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    marginBottom: 30,
  },
});
