export interface Cell {
  row: number;        // 0 a 9
  col: number;        // 0 a 9
  hasShip: boolean;   // existe navio nesta célula
  hit: boolean;       // célula já foi atingida
}
