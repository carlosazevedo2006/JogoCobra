import { useState } from 'react';

export type NetworkStatus = 'disconnected' | 'connecting' | 'connected';

export function useNetwork() {
  const [status, setStatus] = useState<NetworkStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);

  function connect() {
    setStatus('connecting');

    // Simulação (substituído por sockets mais tarde)
    setTimeout(() => {
      setStatus('connected');
    }, 500);
  }

  function disconnect() {
    setStatus('disconnected');
  }

  return {
    status,
    error,
    connect,
    disconnect,
  };
}
