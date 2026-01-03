import { Board } from '../models/Board';
import { ShotResult } from '../models/ShotResult';
import { Ship } from '../models/Ship';

// Disparo numa célula
export function shoot(board: Board, row: number, col: number): ShotResult {
  const cell = board.grid[row][col];
  if (cell.hit) return 'water';

  cell.hit = true;
  if (!cell.hasShip) return 'water';

  const ship = findShip(board.ships, row, col);
  if (!ship) return 'hit';

  ship.hits++;
  return ship.hits >= ship.size ? 'sunk' : 'hit';
}

// Procura navio numa posição
function findShip(ships: Ship[], row: number, col: number): Ship | undefined {
  return ships.find(s => s.positions.some(p => p.row === row && p.col === col));
}

// Verifica fim de jogo
export function areAllShipsSunk(board: Board): boolean {
  return board.ships.every(s => s.hits >= s.size);
}
