import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface FoodProps {
  color: string; // Cor da comida (passada por prop)
}

/**
 * Componente que representa a comida da cobra
 * - Inclui animação de "pulse" quando aparece
 * - Usa Animated API para transições suaves
 * - Design circular com cor customizável
 */
const Food: React.FC<FoodProps> = ({ color }) => {
  /**
   * Estado animado para o efeito de escala
   * Animated.Value é usado para animações de performance
   * Valor inicial: 0 (comida começa invisível)
   */
  const [scaleAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  /**
   * Efeito para animação de entrada quando a comida aparece
   * Executa quando o componente é montado (nova comida gerada)
   */
  useEffect(() => {
    /**
     * SEQUÊNCIA DE ANIMAÇÕES:
     * 1. Escala de 0 → 1.3 (crescimento exagerado)
     * 2. Escala de 1.3 → 1 (volta ao normal)
     * 3. Loop de pulse sutil (opcional)
     */
    Animated.sequence([
      // Animação de entrada
      Animated.timing(scaleAnim, {
        toValue: 1.3,        // Cresce para 130%
        duration: 150,       // 150ms
        useNativeDriver: true, // Acelera no native thread
      }),
      // Animação de estabilização
      Animated.timing(scaleAnim, {
        toValue: 1,          // Volta para 100%
        duration: 100,       // 100ms
        useNativeDriver: true,
      }),
    ]).start(); // Inicia a sequência

    /**
     * Animação de pulse contínuo (sutil)
     * - Cria um loop de 1 → 1.1 → 1
     * - Dá vida à comida
     */
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,      // Aumenta 10%
          duration: 800,     // 800ms
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,        // Volta ao normal
          duration: 800,     // 800ms
          useNativeDriver: true,
        }),
      ])
    ).start();

    /**
     * CLEANUP FUNCTION:
     * Para todas as animações quando o componente desmonta
     * Previne vazamentos de memória e warnings
     */
    return () => {
      scaleAnim.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, [scaleAnim, pulseAnim]); // Dependências: valores animados

  return (
    /**
     * Animated.View permite animar propriedades de estilo
     * Combina duas animações:
     * - scaleAnim: entrada
     * - pulseAnim: pulse contínuo
     */
    <Animated.View
      style={[
        styles.food,
        {
          backgroundColor: color, // Cor dinâmica da prop
          // Combina as duas animações multiplicando os valores
          transform: [
            { scale: scaleAnim },
            { scale: pulseAnim }
          ]
        }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  food: {
    width: '100%',     // Ocupa toda a célula do tabuleiro
    height: '100%',    // Ocupa toda a célula do tabuleiro
    borderRadius: 15,  // Cantos bem arredondados (forma circular)
    
    /**
     * SOMBRA PARA PROFUNDIDADE:
     * - shadowColor: cor da sombra
     * - shadowOffset: direção da sombra
     * - shadowOpacity: transparência
     * - shadowRadius: desfoque
     * - elevation: sombra no Android
     */
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Food;

/**
 * ALTERNATIVAS DE ANIMAÇÃO (PARA EXPLORAR):
 * 
 * 1. ROTAÇÃO:
 *    const rotateAnim = useState(new Animated.Value(0))[0];
 *    // Interpolar para valores de rotação
 *    const rotate = rotateAnim.interpolate({
 *      inputRange: [0, 1],
 *      outputRange: ['0deg', '360deg']
 *    });
 * 
 * 2. OPACIDADE PISCANTE:
 *    Animated.sequence([
 *      Animated.timing(opacityAnim, { toValue: 0.5, duration: 500 }),
 *      Animated.timing(opacityAnim, { toValue: 1, duration: 500 }),
 *    ])
 * 
 * 3. ANIMAÇÃO DE "PULO":
 *    Animated.sequence([
 *      Animated.timing(translateYAnim, { toValue: -10, duration: 200 }),
 *      Animated.timing(translateYAnim, { toValue: 0, duration: 200 }),
 *    ])
 */