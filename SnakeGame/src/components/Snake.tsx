import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SnakeProps {
  isHead: boolean;    // Se este segmento é a cabeça
  color: string;      // Cor da cobra
}

/**
 * Componente que representa um segmento individual da cobra
 * A cabeça tem visual diferente do corpo
 */
const Snake: React.FC<SnakeProps> = ({ 
  isHead, 
  color 
}) => {
  return (
    <View
      style={[
        styles.snakeSegment,        // Estilo base para todos segmentos
        { backgroundColor: color }, // Cor dinâmica da prop
        isHead && styles.snakeHead  // Estilos adicionais apenas para cabeça
      ]}
    />
  );
};

const styles = StyleSheet.create({
  snakeSegment: {
    width: '100%',     // Ocupa toda a célula do tabuleiro
    height: '100%',    // Ocupa toda a célula do tabuleiro
    borderRadius: 5,   // Cantos levemente arredondados para corpo
  },
  snakeHead: {
    borderRadius: 8,   // Cabeça mais arredondada
    borderWidth: 2,    // Borda para destacar a cabeça
    borderColor: '#2E7D32', // Verde escuro para contraste
  },
});

export default Snake;