import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Position } from '../types/gameTypes';
import Snake from './Snake';
import Food from './Food';

interface GameBoardProps {
  boardSize: number;     // Tamanho do tabuleiro (N x N)
  snake: Position[];     // Array de posições da cobra
  food: Position;        // Posição atual da comida
  snakeColor: string;    // Cor da cobra
  foodColor: string;     // Cor da comida
}

/**
 * Componente que renderiza o tabuleiro completo do jogo
 * - Cria grade N x N de células
 * - Posiciona cobra e comida nas posições corretas
 * - Responsivo e com bordas visíveis
 */
const GameBoard: React.FC<GameBoardProps> = ({
  boardSize,
  snake,
  food,
  snakeColor,
  foodColor
}) => {
  /**
   * Função para renderizar uma célula individual do tabuleiro
   * @param x Coordenada X (coluna)
   * @param y Coordenada Y (linha)
   * @returns Componente View representando a célula
   */
  const renderCell = (x: number, y: number) => {
    // Verifica se há algum segmento da cobra nesta posição
    const isSnake = snake.some(segment => 
      segment[0] === x && segment[1] === y
    );
    
    // Verifica se esta célula contém a comida
    const isFood = food[0] === x && food[1] === y;
    
    // Verifica se esta célula é a cabeça da cobra
    const isHead = snake[0][0] === x && snake[0][1] === y;

    return (
      <View
        key={`${x}-${y}`} // Chave única baseada nas coordenadas
        style={[
          styles.cell,
          // Fundo colorido se for cobra ou comida, senão fundo padrão
          isSnake && { backgroundColor: snakeColor },
          isFood && { backgroundColor: foodColor }
        ]}
      >
        {/* Renderiza componente Snake se esta célula for parte da cobra */}
        {isSnake && (
          <Snake 
            isHead={isHead}       // Passa se é cabeça para estilização diferente
            color={snakeColor}    // Cor da cobra
          />
        )}
        
        {/* Renderiza componente Food se esta célula tiver comida */}
        {isFood && (
          <Food color={foodColor} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 
        TABULEiro principal 
        Largura e altura calculadas dinamicamente baseadas no boardSize
        Cada célula: 30px + 2px de margem = 32px por célula
      */}
      <View 
        style={[
          styles.board, 
          { 
            width: boardSize * 32,   // Largura total
            height: boardSize * 32   // Altura total
          }
        ]}
      >
        {/**
         * CRIAÇÃO DA GRADE:
         * Array.from cria um array com boardSize * boardSize elementos
         * .map itera sobre cada elemento (índice é a posição linear)
         */}
        {Array.from({ length: boardSize * boardSize }).map((_, index) => {
          // Converte índice linear para coordenadas 2D
          const x = index % boardSize;           // Coluna: resto da divisão
          const y = Math.floor(index / boardSize); // Linha: divisão inteira
          
          return renderCell(x, y);
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container flex para centralizar o tabuleiro
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20, // Espaço acima e abaixo
  },
  board: {
    /**
     * LAYOUT DO TABULEIRO:
     * - flexDirection: 'row' → células em linha horizontal
     * - flexWrap: 'wrap' → quebra para nova linha quando necessário
     * - border: borda ao redor do tabuleiro
     * - background: cor de fundo entre células
     */
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#ddd', // Cor dos "caminhos" entre células
  },
  cell: {
    /**
     * ESTILO BASE DE CADA CÉLULA:
     * - Tamanho fixo 30x30 pixels
     * - Margem de 1px cria espaço entre células
     * - Fundo padrão cinza claro
     */
    width: 30,
    height: 30,
    margin: 1,
    backgroundColor: '#eee', // Cor padrão da célula vazia
  },
});

export default GameBoard;

/**
 * OTIMIZAÇÕES E MELHORIAS FUTURAS:
 * 
 * 1. MEMOIZATION:
 *    - Usar React.memo no componente para evitar re-renders desnecessários
 *    - Implementar shouldComponentUpdate personalizado
 * 
 * 2. PERFORMANCE PARA TABULEIROS GRANDES:
 *    - Virtualização para tabuleiros muito grandes
 *    - FlatList com numColumns para renderização eficiente
 * 
 * 3. ESTILOS AVANÇADOS:
 *    - Gradientes para células
 *    - Animações de transição entre estados
 *    - Efeitos visuais para bordas
 * 
 * 4. ACESSIBILIDADE:
 *    - Adicionar labels para screen readers
 *    - Indicar posições para usuários com deficiência visual
 */