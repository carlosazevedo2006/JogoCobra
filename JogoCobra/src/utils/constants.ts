// src/utils/constants.ts
import { Posicao } from "../types/types";

// tamanho da grelha
export const GRID_SIZE = 10;

// tamanho de cada célula do tabuleiro
export const CELULA = 32;

// direções possíveis
export const DIRECOES = {
  CIMA: { x: 0, y: -1 },
  BAIXO: { x: 0, y: 1 },
  ESQUERDA: { x: -1, y: 0 },
  DIREITA: { x: 1, y: 0 },
};

// compara duas posições
export function igual(a: Posicao, b: Posicao) {
  return a.x === b.x && a.y === b.y;
}

// gera posição da comida sem colidir com a cobra
export function gerarComida(cobra: Posicao[]) {
  while (true) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);

    const pos = { x, y };

    // garante que a comida NÃO nasce em cima da cobra
    if (!cobra.some((seg) => igual(seg, pos))) {
      return pos;
    }
  }
}
