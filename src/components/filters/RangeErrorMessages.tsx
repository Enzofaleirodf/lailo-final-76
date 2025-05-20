
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RangeErrorMessagesProps {
  minError: string | null;
  maxError: string | null;
  minErrorId: string;
  maxErrorId: string;
}

/**
 * Componente para exibir mensagens de erro de filtro de intervalo
 * Garante consistência visual entre desktop e mobile
 */
const RangeErrorMessages: React.FC<RangeErrorMessagesProps> = ({ 
  minError, 
  maxError, 
  minErrorId, 
  maxErrorId 
}) => {
  const isMobile = useIsMobile();
  
  // Se não houver erros, não renderizar nada
  if (!minError && !maxError) {
    return null;
  }
  
  // Classes para garantir consistência visual entre dispositivos
  const errorClasses = "text-xs text-red-600 animate-fadeIn";
  
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
      {minError && (
        <p 
          id={minErrorId} 
          className={errorClasses}
          role="alert"
        >
          <span aria-hidden="true">⚠️ </span>{minError}
        </p>
      )}
      {maxError && (
        <p 
          id={maxErrorId} 
          className={errorClasses}
          role="alert"
        >
          <span aria-hidden="true">⚠️ </span>{maxError}
        </p>
      )}
    </div>
  );
};

export default React.memo(RangeErrorMessages);
