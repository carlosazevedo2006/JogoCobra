import { BOARD_SIZE } from './constants';
import { Board } from '../models/Board';
import { Cell } from '../models/Cell';

// Cria uma célula vazia
export function createCell(row: number, col: number): Cell {
  return {
    row,
    col,
    hasShip: false,
    hit: false,
  };
}

// Cria um tabuleiro vazio 10x10
export function createEmptyBoard(): Board {
  const grid: Cell[][] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowCells: Cell[] = [];

    for (let col = 0; col < BOARD_SIZE; col++) {
      rowCells.push(createCell(row, col));
    }

    grid.push(rowCells);
  }

  return {
    grid,
    ships: [],
  };
}

// Verifica se uma posição está dentro do tabuleiro
export function isInsideBoard(row: number, col: number): boolean {
  return (
    row >= 0 &&
    row < BOARD_SIZE &&
    col >= 0 &&
    col < BOARD_SIZE
  );
}
