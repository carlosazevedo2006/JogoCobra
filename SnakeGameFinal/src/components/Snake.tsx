import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SnakeProps {
  isHead: boolean;
  color: string;
}

const Snake: React.FC<SnakeProps> = ({ isHead, color }) => {
  return (
    <View
      style={[
        styles.snakeSegment,
        { backgroundColor: color },
        isHead && styles.snakeHead
      ]}
    />
  );
};

const styles = StyleSheet.create({
  snakeSegment: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  snakeHead: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
});

export default Snake;