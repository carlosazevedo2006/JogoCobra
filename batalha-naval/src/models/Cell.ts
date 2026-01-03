// Representa uma célula do tabuleiro
export interface Cell {
  row: number;
  col: number;
  hasShip: boolean;
  hit: boolean;
}
