import { View, Text, StyleSheet, Alert } from 'react-native';
import { Board } from '../components/Board';
import { useGame } from '../hooks/useGame';
import { useEffect } from 'react';

export function GameScreen() {
  const { gameState, fire } = useGame();

  // Segurança: jogo ainda não iniciado
  if (gameState.players.length < 2) {
    return (
      <View style={styles.center}>
        <Text>Jogo não iniciado</Text>
      </View>
    );
  }

  const currentPlayer = gameState.players.find(
    p => p.id === gameState.currentTurnPlayerId
  );

  const opponent = gameState.players.find(
    p => p.id !== gameState.currentTurnPlayerId
  );

  if (!currentPlayer || !opponent) {
    return null;
  }

  function handleFire(row: number, col: number) {
    const result = fire(currentPlayer.id, row, col);

    if (!result) return;

    if (result === 'water') {
      Alert.alert('Resultado', 'Água!');
    }

    if (result === 'hit') {
      Alert.alert('Resultado', 'Acertou!');
    }

    if (result === 'sunk') {
      Alert.alert('Resultado', 'Navio afundado!');
    }
  }

  // Fim de jogo
  useEffect(() => {
    if (gameState.phase === 'finished' && gameState.winnerId) {
      Alert.alert(
        'Fim de Jogo',
        `Vencedor: ${
          gameState.players.find(p => p.id === gameState.winnerId)?.name
        }`
      );
    }
  }, [gameState.phase]);

  return (
    <View style={styles.container}>
      <Text style={styles.turnText}>
        Turno: {currentPlayer.name}
      </Text>

      <Text style={styles.title}>Meu Oceano</Text>
      <Board
        board={currentPlayer.board}
        showShips={true}
      />

      <Text style={styles.title}>Radar do Inimigo</Text>
      <Board
        board={opponent.board}
        onCellPress={handleFire}
        showShips={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
