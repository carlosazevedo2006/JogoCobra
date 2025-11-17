// Define o tipo para uma posição no tabuleiro (coordenadas x, y)
export type Position = [number, number];

// Enumeração das direções possíveis que a cobra pode tomar
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Estados possíveis do jogo
export type GameStatus = 'PLAYING' | 'GAME_OVER' | 'PAUSED';

// Interface que define a estrutura completa do estado do jogo
export interface GameState {
  snake: Position[];        // Array de posições que formam a cobra
  food: Position;           // Posição atual da comida
  direction: Direction;     // Direção atual do movimento
  status: GameStatus;       // Estado atual do jogo
  score: number;            // Pontuação atual do jogador
  highScore: number;        // Melhor pontuação registrada
  speed: number;            // Velocidade atual (intervalo em ms)
}

// Interface para configurações customizáveis do jogo
export interface GameConfig {
  boardSize: number;        // Tamanho do tabuleiro (N x N)
  initialSpeed: number;     // Velocidade inicial em milissegundos
  speedIncrement: number;   // Quanto a velocidade aumenta por ponto
  snakeColor: string;       // Cor da cobra
  foodColor: string;        // Cor da comida
}