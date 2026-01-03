import { BOARD_SIZE } from './constants';
import { Board } from '../models/Board';
import { Cell } from '../models/Cell';

// Cria uma célula vazia
export function createCell(row: number, col: number): Cell {
  return { row, col, hasShip: false, hit: false };
}

// Cria um tabuleiro vazio 10x10
export function createEmptyBoard(): Board {
  const grid: Cell[][] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      row.push(createCell(r, c));
    }
    grid.push(row);
  }

  return { grid, ships: [] };
}

// Verifica se posição está dentro do tabuleiro
export function isInsideBoard(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}
