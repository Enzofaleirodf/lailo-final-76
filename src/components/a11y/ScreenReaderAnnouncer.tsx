
import React, { useEffect, useRef } from 'react';

interface ScreenReaderAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number;
}

/**
 * Componente para anunciar mensagens para leitores de tela
 * Útil para feedback dinâmico de ações do usuário
 */
const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  message,
  priority = 'polite',
  clearAfter = 5000
}) => {
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message || !announcerRef.current) return;

    announcerRef.current.textContent = message;

    const timer = setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = '';
      }
    }, clearAfter);

    return () => clearTimeout(timer);
  }, [message, clearAfter]);

  return (
    <div
      ref={announcerRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    />
  );
};

export default ScreenReaderAnnouncer;
