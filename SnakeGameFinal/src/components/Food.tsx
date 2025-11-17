import React from 'react';
import { View, StyleSheet } from 'react-native';

interface FoodProps {
  color: string;
}

const Food: React.FC<FoodProps> = ({ color }) => {
  return (
    <View
      style={[
        styles.food,
        { backgroundColor: color }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  food: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
});

export default Food;