export type Position = [number, number];
export type Direction = 'CIMA' | 'BAIXO' | 'ESQUERDA' | 'DIREITA';
export type GameStatus = 'JOGANDO' | 'FIM_DE_JOGO' | 'PAUSADO';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  status: GameStatus;
  score: number;
  highScore: number;
  speed: number;
}

export interface GameConfig {
  boardSize: number;
  initialSpeed: number;
  speedIncrement: number;
  snakeColor: string;
  foodColor: string;
}