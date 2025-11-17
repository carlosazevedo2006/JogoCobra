import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import SnakeGame from './src/SnakeGame';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      <SnakeGame />
    </SafeAreaView>
  );
}