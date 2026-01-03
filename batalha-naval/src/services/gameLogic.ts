import { Board } from '../models/Board';
import { ShotResult } from '../models/ShotResult';

export function shoot(board: Board, row: number, col: number): { result: ShotResult; updatedBoard: Board } {
  const updatedBoard: Board = {
    cells: board.cells.map(r => r.map(c => ({ ...c }))),
    ships: board.ships.map(s => ({ ...s, cells: [...s.cells] })),
  };

  const cell = updatedBoard.cells[row][col];
  if (cell.hit) {
    // Já foi atingida, conta como água repetida para evitar bug
    return { result: { outcome: 'water', position: { row, col } }, updatedBoard };
  }
  cell.hit = true;

  if (!cell.shipId) {
    return { result: { outcome: 'water', position: { row, col } }, updatedBoard };
  }

  const ship = updatedBoard.ships.find(s => s.id === cell.shipId)!;
  ship.hits += 1;

  const sunk = ship.hits >= ship.size;
  if (sunk) {
    return { result: { outcome: 'sunk', shipId: ship.id, position: { row, col } }, updatedBoard };
  }
  return { result: { outcome: 'hit', shipId: ship.id, position: { row, col } }, updatedBoard };
}

export function areAllShipsSunk(board: Board): boolean {
  return board.ships.length > 0 && board.ships.every(s => s.hits >= s.size);
}