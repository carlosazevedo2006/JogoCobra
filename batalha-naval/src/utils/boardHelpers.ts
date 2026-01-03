import { Board, BOARD_SIZE, Cell, Ship } from '../models/Board';

export function createEmptyBoard(): Board {
  const cells: Cell[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      row.push({ row: r, col: c, hit: false });
    }
    cells.push(row);
  }
  return { cells, ships: [] };
}

function inBounds(row: number, col: number) {
  return row >= 0 && col >= 0 && row < BOARD_SIZE && col < BOARD_SIZE;
}

function hasContact(board: Board, positions: { row: number; col: number }[]) {
  const deltas = [
    { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
    { dr: 0, dc: -1 },                    { dr: 0, dc: 1 },
    { dr: 1, dc: -1 },  { dr: 1, dc: 0 }, { dr: 1, dc: 1 },
  ];
  for (const pos of positions) {
    for (const { dr, dc } of deltas) {
      const nr = pos.row + dr;
      const nc = pos.col + dc;
      if (!inBounds(nr, nc)) continue;
      const neighbor = board.cells[nr][nc];
      if (neighbor.shipId) {
        // Se o navio vizinho não for o próprio (para recolocação), é contacto
        if (!positions.some(p => p.row === nr && p.col === nc)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function canPlaceShip(board: Board, startRow: number, startCol: number, size: number, orientation: 'H' | 'V') {
  const positions: { row: number; col: number }[] = [];
  for (let i = 0; i < size; i++) {
    const r = orientation === 'H' ? startRow : startRow + i;
    const c = orientation === 'H' ? startCol + i : startCol;
    if (!inBounds(r, c)) return false;
    if (board.cells[r][c].shipId) return false; // não sobrepor
    positions.push({ row: r, col: c });
  }
  // regra sem contacto
  if (hasContact(board, positions)) return false;
  return true;
}

export function placeShip(board: Board, shipId: string, size: number, startRow: number, startCol: number, orientation: 'H' | 'V'): Board {
  if (!canPlaceShip(board, startRow, startCol, size, orientation)) return board;
  const newBoard: Board = {
    cells: board.cells.map(row => row.map(cell => ({ ...cell }))),
    ships: board.ships.map(s => ({ ...s, cells: [...s.cells] })),
  };
  const positions: { row: number; col: number }[] = [];
  for (let i = 0; i < size; i++) {
    const r = orientation === 'H' ? startRow : startRow + i;
    const c = orientation === 'H' ? startCol + i : startCol;
    positions.push({ row: r, col: c });
  }
  newBoard.ships.push({ id: shipId, size, cells: positions, hits: 0 });
  for (const pos of positions) {
    newBoard.cells[pos.row][pos.col].shipId = shipId;
  }
  return newBoard;
}