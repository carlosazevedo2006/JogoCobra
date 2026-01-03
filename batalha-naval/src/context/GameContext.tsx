import React, { createContext, useContext } from 'react';
import { useGame } from '../hooks/useGame';

const GameContext = createContext<ReturnType<typeof useGame> | null>(null);

export default function GameProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const game = useGame();

  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGameContext deve ser usado dentro do GameProvider');
  }

  return context;
}
