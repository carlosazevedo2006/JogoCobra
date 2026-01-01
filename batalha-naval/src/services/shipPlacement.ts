import { Board } from '../models/Board';
import { Ship, ShipOrientation, ShipPosition } from '../models/Ship';
import { BOARD_SIZE, SHIPS_CONFIG } from '../utils/constants';
import { isInsideBoard } from '../utils/boardHelpers';
import { randomInt, randomFromArray } from '../utils/random';

/**
 * Verifica se um navio pode ser colocado numa determinada posição
 * - dentro do tabuleiro
 * - sem sobreposição
 * - sem contacto (lado ou diagonal)
 */
export function canPlaceShip(
  board: Board,
  startRow: number,
  startCol: number,
  size: number,
  orientation: ShipOrientation
): boolean {
  const positions: ShipPosition[] = [];

  // Calcular posições do navio
  for (let i = 0; i < size; i++) {
    const row = orientation === 'horizontal' ? startRow : startRow + i;
    const col = orientation === 'horizontal' ? startCol + i : startCol;

    if (!isInsideBoard(row, col)) {
      return false;
    }

    positions.push({ row, col });
  }

  // Verificar sobreposição e contacto (lado e diagonal)
  for (const pos of positions) {
    for (let r = pos.row - 1; r <= pos.row + 1; r++) {
      for (let c = pos.col - 1; c <= pos.col + 1; c++) {
        if (!isInsideBoard(r, c)) continue;

        if (board.grid[r][c].hasShip) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Coloca um navio no tabuleiro
 */
export function placeShip(
  board: Board,
  shipName: string,
  size: number,
  startRow: number,
  startCol: number,
  orientation: ShipOrientation
): Ship | null {
  if (!canPlaceShip(board, startRow, startCol, size, orientation)) {
    return null;
  }

  const positions: ShipPosition[] = [];

  for (let i = 0; i < size; i++) {
    const row = orientation === 'horizontal' ? startRow : startRow + i;
    const col = orientation === 'horizontal' ? startCol + i : startCol;

    board.grid[row][col].hasShip = true;
    positions.push({ row, col });
  }

  const ship: Ship = {
    id: `${shipName}-${Date.now()}-${Math.random()}`,
    name: shipName,
    size,
    positions,
    hits: 0,
    orientation,
  };

  board.ships.push(ship);
  return ship;
}

/**
 * Coloca toda a frota de forma aleatória no tabuleiro
 */
export function placeFleetRandomly(board: Board): boolean {
  // Limpar tabuleiro
  board.ships = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      board.grid[row][col].hasShip = false;
      board.grid[row][col].hit = false;
    }
  }

  // Colocar cada navio da frota
  for (const shipConfig of SHIPS_CONFIG) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;

      const orientation: ShipOrientation = randomFromArray([
        'horizontal',
        'vertical',
      ]);

      const startRow = randomInt(0, BOARD_SIZE - 1);
      const startCol = randomInt(0, BOARD_SIZE - 1);

      const ship = placeShip(
        board,
        shipConfig.name,
        shipConfig.size,
        startRow,
        startCol,
        orientation
      );

      if (ship) {
        placed = true;
      }
    }

    // Segurança extra (muito improvável acontecer)
    if (!placed) {
      console.warn(`Falha ao colocar o navio: ${shipConfig.name}`);
      return false;
    }
  }

  return true;
}
