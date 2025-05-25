
import { useEffect, useRef } from 'react';

/**
 * Hook para gerenciar limpeza de recursos
 */
export const useCleanup = () => {
  const cleanupFunctions = useRef<(() => void)[]>([]);

  const addCleanup = (fn: () => void) => {
    cleanupFunctions.current.push(fn);
  };

  const cleanup = () => {
    cleanupFunctions.current.forEach(fn => {
      try {
        fn();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error during cleanup:', error);
        }
      }
    });
    cleanupFunctions.current = [];
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return { addCleanup, cleanup };
};
