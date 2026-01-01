import { Board } from './Board';

export interface Player {
  id: string;
  name: string;
  board: Board;
  isReady: boolean; // terminou a colocação da frota
}
