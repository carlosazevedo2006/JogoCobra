import { Board } from '../models/Board';
import { ShotResult } from '../models/ShotResult';
import { Ship } from '../models/Ship';

/**
 * Dispara numa célula do tabuleiro
 */
export function shoot(
  board: Board,
  row: number,
  col: number
): ShotResult {
  const cell = board.grid[row][col];

  // Já foi atingida
  if (cell.hit) {
    return 'water';
  }

  cell.hit = true;

  // Água
  if (!cell.hasShip) {
    return 'water';
  }

  // Acertou num navio
  const ship = findShipAtPosition(board.ships, row, col);

  if (!ship) {
    return 'hit';
  }

  ship.hits++;

  // Navio afundado
  if (ship.hits >= ship.size) {
    return 'sunk';
  }

  return 'hit';
}

/**
 * Procura o navio que ocupa uma determinada posição
 */
function findShipAtPosition(
  ships: Ship[],
  row: number,
  col: number
): Ship | undefined {
  return ships.find(ship =>
    ship.positions.some(pos => pos.row === row && pos.col === col)
  );
}

/**
 * Verifica se todos os navios foram afundados
 */
export function areAllShipsSunk(board: Board): boolean {
  return board.ships.every(ship => ship.hits >= ship.size);
}
