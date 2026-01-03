import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GameState, GamePhase } from '../models/GameState';
import { Player } from '../models/Player';
import { createEmptyBoard } from '../utils/boardHelpers';
import { shoot, areAllShipsSunk } from '../services/gameLogic';
import { ShotResult } from '../models/ShotResult';
import { Network } from '../services/network';

interface GameContextType {
  gameState: GameState;
  createLocalPlayers: (player1Name: string, player2Name: string) => void;
  setPlayerReady: (playerId: string) => void;
  fire: (attackerId: string, targetRow: number, targetCol: number) => ShotResult | null;
  resetGame: () => void;
  updatePhase: (phase: GamePhase) => void;

  // Multiplayer helpers
  connectServer: (serverUrl: string) => Promise<void>;
  createRoom: (playerName: string) => void;
  joinRoom: (playerName: string, roomId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentTurnPlayerId: '',
    phase: 'lobby',
  });

  const [network] = useState(() => new Network());

  useEffect(() => {
    // Listeners de rede (mensagens do servidor)
    network.on('ROOM_CREATED', ({ roomId, player }) => {
      setGameState({
        players: [player],
        currentTurnPlayerId: '',
        phase: 'setup',
        roomId,
        selfId: player.id,
      } as any);
    });

    network.on('ROOM_JOINED', ({ roomId, players, selfId }) => {
      setGameState({
        players,
        currentTurnPlayerId: players[0]?.id ?? '',
        phase: 'setup',
        roomId,
        selfId,
      } as any);
    });

    network.on('PLAYER_READY', ({ players }) => {
      setGameState(prev => {
        const allReady = players.every(p => p.isReady);
        return {
          ...prev,
          players,
          phase: allReady ? 'playing' : prev.phase,
          currentTurnPlayerId: allReady ? players[0].id : prev.currentTurnPlayerId,
        };
      });
    });

    network.on('PLACE_SHIPS', ({ players }) => {
      setGameState(prev => ({ ...prev, players }));
    });

    network.on('FIRE_RESULT', ({ updatedPlayers, attackerId, defenderId, result }) => {
      const defender = updatedPlayers.find(p => p.id === defenderId);
      const gameFinished = defender ? areAllShipsSunk(defender.board) : false;
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        currentTurnPlayerId: attackerId === updatedPlayers[0].id ? updatedPlayers[1].id : updatedPlayers[0].id,
        phase: gameFinished ? 'finished' : prev.phase,
        winnerId: gameFinished ? attackerId : prev.winnerId,
      }));
    });

    network.on('RESET', () => {
      resetGame();
    });
  }, [network]);

  function createLocalPlayers(player1Name: string, player2Name: string) {
    const player1: Player = {
      id: 'player1',
      name: player1Name,
      board: createEmptyBoard(),
      isReady: false,
    };

    const player2: Player = {
      id: 'player2',
      name: player2Name,
      board: createEmptyBoard(),
      isReady: false,
    };

    setGameState({
      players: [player1, player2],
      currentTurnPlayerId: player1.id,
      phase: 'setup',
    });
  }

  function setPlayerReady(playerId: string) {
    setGameState(prev => {
      const players = prev.players.map(player =>
        player.id === playerId ? { ...player, isReady: true } : player
      );
      const allReady = players.every(p => p.isReady);
      return {
        ...prev,
        players,
        phase: allReady ? 'playing' : prev.phase,
        currentTurnPlayerId: allReady ? players[0].id : prev.currentTurnPlayerId,
      };
    });

    // Broadcast para multiplayer
    network.emit('PLAYER_READY', { playerId });
  }

  function fire(attackerId: string, targetRow: number, targetCol: number): ShotResult | null {
    const attackerIndex = gameState.players.findIndex(p => p.id === attackerId);
    if (attackerIndex === -1) return null;
    if (gameState.currentTurnPlayerId !== attackerId) return null;

    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const defender = gameState.players[defenderIndex];

    const { result, updatedBoard } = shoot(defender.board, targetRow, targetCol);

    const updatedDefender: Player = { ...defender, board: updatedBoard };
    const updatedPlayers = gameState.players.map((p, i) => (i === defenderIndex ? updatedDefender : p));

    const gameFinished = areAllShipsSunk(updatedDefender.board);

    setGameState(prev => {
      const nextTurn = prev.players[defenderIndex].id; // regra B: alterna sempre
      return {
        ...prev,
        players: updatedPlayers,
        currentTurnPlayerId: nextTurn,
        phase: gameFinished ? 'finished' : prev.phase,
        winnerId: gameFinished ? attackerId : prev.winnerId,
      };
    });

    // Broadcast para multiplayer
    network.emit('FIRE', { attackerId, targetRow, targetCol });

    return result;
  }

  function resetGame() {
    setGameState({
      players: [],
      currentTurnPlayerId: '',
      phase: 'lobby',
    });
    network.emit('RESET', {});
  }

  function updatePhase(phase: GamePhase) {
    setGameState(prev => ({ ...prev, phase }));
  }

  async function connectServer(serverUrl: string) {
    await network.connect(serverUrl);
  }

  function createRoom(playerName: string) {
    const player: Player = {
      id: network.makePlayerId(),
      name: playerName,
      board: createEmptyBoard(),
      isReady: false,
    };
    network.emit('CREATE_ROOM', { player });
  }

  function joinRoom(playerName: string, roomId: string) {
    const player: Player = {
      id: network.makePlayerId(),
      name: playerName,
      board: createEmptyBoard(),
      isReady: false,
    };
    network.emit('JOIN_ROOM', { roomId, player });
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        createLocalPlayers,
        setPlayerReady,
        fire,
        resetGame,
        updatePhase,
        connectServer,
        createRoom,
        joinRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}