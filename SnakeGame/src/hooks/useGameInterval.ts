import { useEffect, useRef } from 'react';

/**
 * Hook personalizado para setInterval que funciona corretamente no React
 * Resolve o problema clássico do setInterval com closures e estados antigos
 * @param callback Função a ser executada a cada intervalo
 * @param delay Delay em milissegundos (null = pausado)
 */
export const useGameInterval = (
  callback: () => void, 
  delay: number | null
) => {
  // useRef guarda a referência do callback entre renders
  // Não causa re-render quando atualizado
  const savedCallback = useRef<() => void>();

  // Atualiza o ref sempre que o callback mudar
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]); // Executa quando callback mudar

  // Configura e limpa o intervalo
  useEffect(() => {
    /**
     * Função que executa o callback atual
     * Usa a referência do ref para sempre ter a versão mais recente
     */
    function tick() {
      // ?. operador optional chaining - só executa se não for undefined
      savedCallback.current?.();
    }
    
    // Só cria o intervalo se delay não for null
    if (delay !== null) {
      // Cria o intervalo do JavaScript
      const id = setInterval(tick, delay);
      
      // Função de cleanup - executada quando:
      // 1. Componente desmonta
      // 2. Dependência [delay] muda
      return () => clearInterval(id);
    }
  }, [delay]); // Re-executa quando delay mudar
};