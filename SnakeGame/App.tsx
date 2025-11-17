import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import SnakeGame from './src/App';

/**
 * COMPONENTE RAIZ DO APLICATIVO
 * 
 * FUNÇÕES:
 * 1. Configurar áreas seguras da tela
 * 2. Configurar status bar
 * 3. Renderizar o componente principal do jogo
 * 4. Prover contexto global se necessário
 */
export default function App() {
  return (
    /**
     * SafeAreaView: Garante que o conteúdo não fique sob
     * a notch (iPhone) ou áreas de sistema
     */
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      {/**
       * StatusBar: Controla a aparência da barra de status
       * - barStyle: cor dos ícones (escuro para fundo claro)
       * - backgroundColor: cor de fundo da status bar
       */}
      <StatusBar 
        barStyle="dark-content"  // Ícones escuros (para fundo claro)
        backgroundColor="#f0f0f0" // Cor de fundo da status bar
      />
      
      {/** Componente principal do jogo Snake */}
      <SnakeGame />
    </SafeAreaView>
  );
}