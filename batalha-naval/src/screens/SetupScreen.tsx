import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Board } from '../components/Board';
import { useGame } from '../hooks/useGame';
import { placeFleetRandomly } from '../services/shipPlacement';

export function SetupScreen() {
  const { gameState, setPlayerReady } = useGame();

  // Segurança
  if (gameState.players.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Sem jogadores criados</Text>
      </View>
    );
  }

  // ⚠️ Para já assumimos jogador 1 (single-device)
  const player = gameState.players[0];

  function handleRandomPlacement() {
    const success = placeFleetRandomly(player.board);

    if (!success) {
      Alert.alert('Erro', 'Falha na colocação aleatória');
    } else {
      Alert.alert('Sucesso', 'Navios colocados aleatoriamente');
    }
  }

  function handleReady() {
    if (player.board.ships.length === 0) {
      Alert.alert('Erro', 'Coloca os navios primeiro');
      return;
    }

    setPlayerReady(player.id);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Colocação de Navios — {player.name}
      </Text>

      <Board board={player.board} showShips={true} />

      <View style={styles.buttons}>
        <Button
          title="Colocação Aleatória"
          onPress={handleRandomPlacement}
        />
        <View style={{ height: 12 }} />
        <Button
          title="Pronto"
          onPress={handleReady}
        />
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttons: {
    marginTop: 20,
    width: '80%',
  },
});
