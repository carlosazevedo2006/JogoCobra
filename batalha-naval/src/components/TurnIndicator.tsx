import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TurnIndicatorProps {
  playerName: string;
}

export default function TurnIndicator({ playerName }: TurnIndicatorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Turno atual: {playerName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 6,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
