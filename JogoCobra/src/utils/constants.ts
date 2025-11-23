// src/utils/constants.ts
import { Posicao } from "../types/types";

// Tamanho do tabuleiro (12x12 quadrículas)
export const GRID_SIZE = 12;

// Tamanho de cada célula em pixels
export const CELULA = 30;

// DIREÇÕES PERMITIDAS (sem diagonais)
export const DIRECOES = {
  CIMA: { x: 0, y: -1 },
  BAIXO: { x: 0, y: 1 },
  ESQUERDA: { x: -1, y: 0 },
  DIREITA: { x: 1, y: 0 },
};

// Função para gerar posição aleatória da comida
export function gerarComida(cobra: Posicao[]): Posicao {
  let pos: Posicao;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (cobra.some((seg) => seg.x === pos.x && seg.y === pos.y));
  return pos;
}

// Função para comparar posições
export function igual(a: Posicao, b: Posicao): boolean {
  return a.x === b.x && a.y === b.y;
}