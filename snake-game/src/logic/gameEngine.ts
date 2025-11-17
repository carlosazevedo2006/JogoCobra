import { GameState, Direction, Position } from "./gameTypes";

export function randomPosition(boardSize: number): Position {
  return {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  };
}

export function initGame(boardSize: number, best: number): GameState {
  return {
    snake: [{ x: 2, y: 2 }],
    direction: Direction.Right,
    food: randomPosition(boardSize),
    score: 0,
    best,
    boardSize,
    isGameOver: false,
  };
}

export function nextDirection(prev: Direction, next: Direction): Direction {
  // Impedir inversão direta (ex: esquerda → direita)
  if (
    (prev === Direction.Up && next === Direction.Down) ||
    (prev === Direction.Down && next === Direction.Up) ||
    (prev === Direction.Left && next === Direction.Right) ||
    (prev === Direction.Right && next === Direction.Left)
  ) {
    return prev;
  }
  return next;
}

export function updateGame(state: GameState): GameState {
  if (state.isGameOver) return state;

  const head = state.snake[0];

  let newHead = { ...head };

  if (state.direction === Direction.Up) newHead.y -= 1;
  if (state.direction === Direction.Down) newHead.y += 1;
  if (state.direction === Direction.Left) newHead.x -= 1;
  if (state.direction === Direction.Right) newHead.x += 1;

  // Verificar colisão com parede
  if (
    newHead.x < 0 ||
    newHead.x >= state.boardSize ||
    newHead.y < 0 ||
    newHead.y >= state.boardSize
  ) {
    return { ...state, isGameOver: true };
  }

  // Verificar colisão com o próprio corpo
  if (state.snake.some((p) => p.x === newHead.x && p.y === newHead.y)) {
    return { ...state, isGameOver: true };
  }

  let snake = [newHead, ...state.snake];

  let score = state.score;
  let food = state.food;

  // Comer comida
  if (newHead.x === food.x && newHead.y === food.y) {
    score += 1;
    food = randomPosition(state.boardSize);
  } else {
    snake.pop();
  }

  return {
    ...state,
    snake,
    food,
    score,
    best: Math.max(score, state.best),
  };
}
