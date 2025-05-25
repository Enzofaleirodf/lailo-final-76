
import { useState, useCallback } from 'react';

interface AnnouncerOptions {
  priority?: 'polite' | 'assertive';
  clearAfter?: number;
}

/**
 * Hook para gerenciar anúncios para leitores de tela
 */
export const useAnnouncer = (options: AnnouncerOptions = {}) => {
  const { priority = 'polite', clearAfter = 5000 } = options;
  const [message, setMessage] = useState('');

  const announce = useCallback((text: string) => {
    setMessage(text);
    
    // Limpar automaticamente após o tempo especificado
    setTimeout(() => {
      setMessage('');
    }, clearAfter);
  }, [clearAfter]);

  const clear = useCallback(() => {
    setMessage('');
  }, []);

  return {
    message,
    priority,
    announce,
    clear
  };
};
