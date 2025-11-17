// Definimos um tipo para a posição, que é uma tupla [number, number]
export type Position = [number, number];

// Direções possíveis para a cobra
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Status do jogo
export type GameStatus = 'PLAYING' | 'GAME_OVER' | 'PAUSED';

// Interface para o estado do jogo
export interface GameState {
  snake: Position[]; // Array de posições que formam a cobra
  food: Position;    // Posição da comida
  direction: Direction; // Direção atual
  status: GameStatus;   // Status do jogo
  score: number;        // Pontuação atual
  highScore: number;    // Recorde de pontuação
  speed: number;        // Velocidade do jogo (intervalo em ms)
}

// Configurações do jogo
export interface GameConfig {
  boardSize: number;    // Tamanho do tabuleiro (N x N)
  initialSpeed: number; // Velocidade inicial (ms)
  speedIncrement: number; // Quanto diminui a velocidade a cada ponto
  snakeColor: string;   // Cor da cobra
  foodColor: string;    // Cor da comida
}