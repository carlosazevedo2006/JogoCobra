import { Cell } from './Cell';
import { Ship } from './Ship';

// Tabuleiro 10x10 + lista de navios
export interface Board {
  grid: Cell[][];
  ships: Ship[];
}
