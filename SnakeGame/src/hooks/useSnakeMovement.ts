import { useState, useCallback } from 'react';
import { Direction } from '../types/gameTypes';
import { getOppositeDirection } from '../utils/gameHelpers';

/**
 * Hook personalizado para gerenciar o movimento e direção da cobra
 * 
 * FUNCIONALIDADES PRINCIPAIS:
 * 1. Buffer de input - permite múltiplos comandos entre movimentos
 * 2. Prevenção de movimento de 180 graus
 * 3. Atualização síncrona da direção
 * 4. Reset para estado inicial
 * 
 * PROBLEMA RESOLVIDO:
 * Sem buffer de input, se o jogador pressionar duas teclas rapidamente,
 * apenas a primeira seria registrada. Com buffer, todas as direções válidas
 * são armazenadas e a última direção válida é usada.
 * 
 * @param initialDirection - Direção inicial da cobra
 */
export const useSnakeMovement = (initialDirection: Direction) => {
  /**
   * Estado que armazena a direção atual que está sendo usada no movimento
   * Esta é a direção que efetivamente move a cobra no tabuleiro
   */
  const [direction, setDirection] = useState<Direction>(initialDirection);
  
  /**
   * Estado que armazena a próxima direção (buffer de input)
   * Permite que o jogador mude direção múltiplas vezes entre movimentos
   * Apenas a última direção válida será usada no próximo movimento
   */
  const [nextDirection, setNextDirection] = useState<Direction>(initialDirection);

  /**
   * Função para mudar a direção da cobra com verificação de movimento válido
   * 
   * CARACTERÍSTICAS:
   * - Impede movimento de 180 graus (direção oposta)
   * - Armazena no buffer (nextDirection) em vez de mudar diretamente
   * - Usa useCallback para otimização de performance
   * 
   * @param newDirection - Nova direção desejada pelo jogador
   */
  const changeDirection = useCallback((newDirection: Direction) => {
    /**
     * VERIFICAÇÃO DE MOVIMENTO VÁLIDO:
     * - Só permite mudar para direção que não seja oposta à atual
     * - Exemplo: Se indo para DIREITA, não pode virar para ESQUERDA
     * - Isso previne que a cobra colida consigo mesma instantaneamente
     */
    if (newDirection !== getOppositeDirection(direction)) {
      /**
       * Atualiza o buffer de input (nextDirection)
       * Esta direção será efetivada no próximo movimento via updateDirection()
       */
      setNextDirection(newDirection);
      
      /**
       * DEBUG: Descomente para ver as mudanças de direção
       * console.log('Direção mudou de', direction, 'para', newDirection);
       */
    } else {
      /**
       * DEBUG: Movimento inválido bloqueado
       * console.log('Movimento bloqueado: tentou virar 180 graus');
       */
    }
  }, [direction]); // Dependência: direction atual (para verificar movimento oposto)

  /**
   * Função para atualizar a direção atual com a próxima direção do buffer
   * 
   * QUANDO É CHAMADA:
   * - A cada movimento do jogo (no game loop)
   * - Antes de calcular a nova posição da cobra
   * 
   * PORQUE SEPARAR changeDirection E updateDirection?
   * - changeDirection: resposta imediata ao input do jogador
   * - updateDirection: sincronização no momento do movimento
   * Isso cria um sistema de buffer que melhora a responsividade
   */
  const updateDirection = useCallback(() => {
    /**
     * Atualiza a direção efetiva com a direção do buffer
     * Agora a cobra realmente muda de direção no movimento
     */
    setDirection(nextDirection);
    
    /**
     * DEBUG: Descomente para ver a sincronização
     * console.log('Direção sincronizada:', nextDirection);
     */
  }, [nextDirection]); // Dependência: próxima direção no buffer

  /**
   * Função para resetar completamente as direções
   * 
   * USO TÍPICO:
   * - Quando o jogo reinicia
   * - Quando o jogador perde e começa novamente
   * 
   * @param newDirection - Nova direção inicial (normalmente a padrão do jogo)
   */
  const resetDirection = useCallback((newDirection: Direction) => {
    /**
     * Reseta ambos os estados de direção
     * - direction: direção atual em uso
     * - nextDirection: buffer de input
     */
    setDirection(newDirection);
    setNextDirection(newDirection);
    
    /**
     * DEBUG: Descomente para ver o reset
     * console.log('Direções resetadas para:', newDirection);
     */
  }, []); // Sem dependências - função estável que não muda entre renders

  /**
   * RETORNO DO HOOK:
   * Disponibiliza estado e funções para o componente usar
   */
  return {
    direction,           // Direção atual em uso pelo movimento
    nextDirection,       // Próxima direção no buffer (input do jogador)
    changeDirection,     // Função para o jogador mudar direção
    updateDirection,     // Função para sincronizar direção no movimento
    resetDirection       // Função para resetar para estado inicial
  };
};

/**
 * EXEMPLO DE USO NO COMPONENTE:
 * 
 * const {
 *   direction,
 *   nextDirection, 
 *   changeDirection,
 *   updateDirection,
 *   resetDirection
 * } = useSnakeMovement('RIGHT');
 * 
 * // No game loop:
 * const moveSnake = () => {
 *   updateDirection(); // Sincroniza a direção
 *   // ... lógica de movimento usando direction
 * };
 * 
 * // No controle:
 * <Button onPress={() => changeDirection('UP')} />
 */

/**
 * DIAGRAMA DO FLUXO DE DIREÇÃO:
 * 
 * Jogador pressiona tecla → changeDirection('UP')
 *     ↓
 * nextDirection = 'UP' (armazenado no buffer)
 *     ↓  
 * Game loop chama updateDirection() 
 *     ↓
 * direction = 'UP' (efetivado no movimento)
 *     ↓
 * Cobra move para cima no próximo quadro
 */

/**
 * CASOS DE BORDA TRATADOS:
 * 
 * 1. INPUT RÁPIDO:
 *    - Jogador pressiona UP → LEFT rapidamente
 *    - Buffer armazena LEFT (último comando válido)
 *    - Cobra vira para ESQUERDA no próximo movimento
 * 
 * 2. MOVIMENTO INVÁLIDO:
 *    - Cobra indo para DIREITA
 *    - Jogador tenta ESQUERDA → bloqueado
 *    - Buffer mantém direção anterior válida
 * 
 * 3. REINÍCIO:
 *    - resetDirection('RIGHT') define tudo para estado inicial
 *    - Útil após Game Over
 */

/**
 * ALTERNATIVAS DE IMPLEMENTAÇÃO (PARA CONSIDERAR):
 * 
 * 1. Fila de comandos (queue):
 *    - Armazenar múltiplos comandos em ordem
 *    - Processar um por movimento
 *    - Mais complexo mas mais fiel aos inputs
 * 
 * 2. Timestamp de comandos:
 *    - Armazenar horário de cada input
 *    - Usar apenas o mais recente
 *    - Mais preciso para jogos competitivos
 * 
 * 3. Estado global com useReducer:
 *    - Para gerenciamento mais complexo de estado
 *    - Útil se adicionarmos mais estados relacionados ao movimento
 */

/**
 * TESTES SUGERIDOS:
 * 
 * 1. Testar movimento de 180 graus → deve ser bloqueado
 * 2. Testar input rápido → deve usar último comando válido  
 * 3. Testar reset → deve voltar para direção inicial
 * 4. Testar múltiplas mudanças entre movimentos → deve sincronizar corretamente
 */

/**
 * DICAS DE DEBUG:
 * 
 * 1. Para ver o buffer em ação:
 *    useEffect(() => {
 *      console.log('Buffer atualizado:', nextDirection);
 *    }, [nextDirection]);
 * 
 * 2. Para ver a direção efetiva:
 *    useEffect(() => {
 *      console.log('Direção em uso:', direction);
 *    }, [direction]);
 * 
 * 3. Para ver diferenças entre buffer e direção:
 *    useEffect(() => {
 *      if (direction !== nextDirection) {
 *        console.log('Buffer diferente da direção:', nextDirection, 'vs', direction);
 *      }
 *    }, [nextDirection, direction]);
 */