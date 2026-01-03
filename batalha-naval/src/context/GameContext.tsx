import React, { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { GameState, GamePhase } from '../models/GameState';
import { Player } from '../models/Player';
import { createEmptyBoard } from '../utils/boardHelpers';
import { placeFleetRandomly } from '../services/shipPlacement';
import { shoot, areAllShipsSunk } from '../services/gameLogic';
import { ShotResult } from '../models/ShotResult';
import { Network } from '../services/network';
import Constants from 'expo-constants';

interface GameContextType {
  gameState: GameState;
  myPlayerId?: string; // jogador controlado neste dispositivo
  createPlayers: (player1Name: string, player2Name: string) => void;
  setPlayerReady: (playerId: string) => void;
  fire: (attackerId: string, targetRow: number, targetCol: number) => ShotResult | null;
  resetGame: () => void;
  updatePhase: (phase: GamePhase) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function getServerUrl(): string | undefined {
  const extra: any =
    (Constants as any)?.expoConfig?.extra ??
    (Constants as any)?.manifest?.extra ??
    undefined;
  return extra?.serverUrl;
}

function makeRoomId(player1Name: string, player2Name: string): string {
  const extra: any =
    (Constants as any)?.expoConfig?.extra ??
    (Constants as any)?.manifest?.extra ??
    {};
  const salt = extra?.roomSalt ?? 'bn';
  const joined = [player1Name.trim(), player2Name.trim()].sort().join('#') + '#' + salt;
  let h = 0;
  for (let i = 0; i < joined.length; i++) {
    h = (h << 5) - h + joined.charCodeAt(i);
    h |= 0;
  }
  return 'room_' + Math.abs(h);
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentTurnPlayerId: '',
    phase: 'lobby',
  });

  const [myPlayerId, setMyPlayerId] = useState<string | undefined>(undefined);

  const serverUrl = useMemo(() => getServerUrl(), []);
  const multiplayer = !!serverUrl;

  const networkRef = useRef<Network | null>(null);
  const selfIdRef = useRef<string>('cli_' + Math.random().toString(36).slice(2, 8));
  const roomIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!multiplayer) return;
    if (networkRef.current) return;
    const n = new Network();
    networkRef.current = n;

    // O servidor envia o estado autoritativo. Substituímos localmente.
    n.on('SERVER_STATE', (state: GameState) => {
      setGameState(state);
    });

    (async () => {
      try {
        await n.connect(serverUrl!);
      } catch (e) {
        console.warn('Falha ao ligar ao servidor WebSocket', e);
      }
    })();
  }, [multiplayer, serverUrl]);

  function createPlayers(player1Name: string, player2Name: string) {
    // IMPORTANTE: o nome no campo "Jogador 1" DESTE dispositivo é o jogador local
    // Mapeamos myPlayerId baseado em qual nome na lista ordenada corresponde ao player1Name local
    const sortedNames = [player1Name.trim(), player2Name.trim()].sort();
    const myNameIndex = sortedNames.indexOf(player1Name.trim());
    const localPlayerId = myNameIndex === 0 ? 'player1' : 'player2';
    
    setMyPlayerId(localPlayerId);

    // Em multiplayer, os IDs dos jogadores são consistentes baseados na ordem alfabética
    // para que ambos os dispositivos tenham o mesmo mapeamento
    const player1: Player = {
      id: 'player1',
      name: sortedNames[0],
      board: createEmptyBoard(),
      isReady: false,
    };

    const player2: Player = {
      id: 'player2',
      name: sortedNames[1],
      board: createEmptyBoard(),
      isReady: false,
    };

    if (!multiplayer) {
      // Em modo local, usamos os nomes na ordem digitada
      player1.name = player1Name;
      player2.name = player2Name;
      setGameState({
        players: [player1, player2],
        currentTurnPlayerId: player1.id,
        phase: 'setup',
      });
      return;
    }

    const roomId = makeRoomId(player1Name, player2Name);
    roomIdRef.current = roomId;

    setGameState({
      players: [player1, player2],
      currentTurnPlayerId: player1.id,
      phase: 'setup',
      selfId: selfIdRef.current,
      roomId,
    });

    networkRef.current?.emit('JOIN_OR_CREATE', {
      roomId,
      selfId: selfIdRef.current,
      playersRequested: [
        { id: 'player1', name: sortedNames[0] },
        { id: 'player2', name: sortedNames[1] },
      ],
    });
  }

  function setPlayerReady(playerId: string) {
    setGameState(prev => {
      const idx = prev.players.findIndex(p => p.id === playerId);
      if (idx === -1) return prev;

      const players = prev.players.map((p, i) => {
        if (i !== idx) return p;
        const boardHasFleet = p.board.ships.length > 0;
        if (!boardHasFleet) {
          // placeFleetRandomly mutates the board in place and returns success boolean
          placeFleetRandomly(p.board);
        }
        return { ...p, isReady: true };
      });

      const allReady = players.every(p => p.isReady);
      const next = {
        ...prev,
        players,
        phase: allReady ? 'playing' : prev.phase,
        currentTurnPlayerId: allReady ? players[0].id : prev.currentTurnPlayerId,
      };

      if (multiplayer && roomIdRef.current) {
        networkRef.current?.emit('PLAYER_READY', {
          roomId: roomIdRef.current,
          playerId,
          board: players[idx].board,
        });
      }

      return next;
    });
  }

  function fire(attackerId: string, targetRow: number, targetCol: number): ShotResult | null {
    // Só permite ação se for o turno deste jogador (proteção extra)
    if (gameState.currentTurnPlayerId !== attackerId) return null;

    const attackerIndex = gameState.players.findIndex(p => p.id === attackerId);
    if (attackerIndex === -1) return null;

    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const defender = gameState.players[defenderIndex];

    const { result, updatedBoard } = shoot(defender.board, targetRow, targetCol);
    const updatedDefender: Player = { ...defender, board: updatedBoard };
    const updatedPlayers = gameState.players.map((p, i) => (i === defenderIndex ? updatedDefender : p));

    const gameFinished = areAllShipsSunk(updatedDefender.board);

    setGameState(prev => {
      const nextTurn = prev.players[defenderIndex].id; // alterna sempre
      return {
        ...prev,
        players: updatedPlayers,
        currentTurnPlayerId: nextTurn,
        phase: gameFinished ? 'finished' : prev.phase,
        winnerId: gameFinished ? attackerId : prev.winnerId,
      };
    });

    if (multiplayer && roomIdRef.current) {
      networkRef.current?.emit('FIRE', {
        roomId: roomIdRef.current,
        attackerId,
        targetRow,
        targetCol,
      });
    }

    return result;
  }

  function resetGame() {
    if (multiplayer && roomIdRef.current) {
      networkRef.current?.emit('RESET', { roomId: roomIdRef.current });
    }
    setGameState({
      players: [],
      currentTurnPlayerId: '',
      phase: 'lobby',
    });
    setMyPlayerId(undefined);
  }

  function updatePhase(phase: GamePhase) {
    setGameState(prev => ({ ...prev, phase }));
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        myPlayerId,
        createPlayers,
        setPlayerReady,
        fire,
        resetGame,
        updatePhase,
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