export type ShipOrientation = 'horizontal' | 'vertical';

export interface ShipPosition {
  row: number;
  col: number;
}

export interface Ship {
  id: string;
  name: string;
  size: number;
  positions: ShipPosition[];
  hits: number;
  orientation: ShipOrientation;
}
