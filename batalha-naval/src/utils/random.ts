// Número inteiro aleatório entre min e max (inclusive)
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Escolhe um item aleatório de um array
export function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
