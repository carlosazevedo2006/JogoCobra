import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Direction } from '../types/gameTypes';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onPause: () => void;
  onRestart: () => void;
  isPlaying: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onDirectionChange,
  onPause,
  onRestart,
  isPlaying
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={onPause}>
          <Text style={styles.buttonText}>{isPlaying ? '⏸️ Pause' : '▶️ Resume'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onRestart}>
          <Text style={styles.buttonText}>🔄 Restart</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Use os botões abaixo para controlar a cobra
        </Text>
      </View>

      <View style={styles.directionPad}>
        <View style={styles.directionRow}>
          <View style={styles.placeholder} />
          <TouchableOpacity 
            style={styles.directionButton} 
            onPress={() => onDirectionChange('UP')}
          >
            <Text style={styles.directionText}>↑</Text>
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.directionRow}>
          <TouchableOpacity 
            style={styles.directionButton} 
            onPress={() => onDirectionChange('LEFT')}
          >
            <Text style={styles.directionText}>←</Text>
          </TouchableOpacity>
          <View style={styles.placeholder} />
          <TouchableOpacity 
            style={styles.directionButton} 
            onPress={() => onDirectionChange('RIGHT')}
          >
            <Text style={styles.directionText}>→</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.directionRow}>
          <View style={styles.placeholder} />
          <TouchableOpacity 
            style={styles.directionButton} 
            onPress={() => onDirectionChange('DOWN')}
          >
            <Text style={styles.directionText}>↓</Text>
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    minWidth: 100,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructions: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  instructionsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  directionPad: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  directionButton: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 5,
  },
  directionText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
    height: 60,
    margin: 5,
  },
});

export default Controls;