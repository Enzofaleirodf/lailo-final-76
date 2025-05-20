
import React from 'react';

interface RangeErrorMessagesProps {
  minError: string | null;
  maxError: string | null;
  minErrorId: string;
  maxErrorId: string;
}

/**
 * Componente para exibir mensagens de erro para campos de intervalo
 * Melhorado para filtrar mensagens de limite mínimo/máximo temporárias
 */
const RangeErrorMessages: React.FC<RangeErrorMessagesProps> = ({
  minError,
  maxError,
  minErrorId,
  maxErrorId
}) => {
  // Filtra mensagens de erro para não mostrar limites após o blur
  // Melhorado para ser mais específico e consistente
  const filteredMinError = minError && !minError.startsWith('Mín:') ? minError : null;
  const filteredMaxError = maxError && !maxError.startsWith('Máx:') ? maxError : null;
  
  // Não renderizar nada se não houver mensagens de erro
  if (!filteredMinError && !filteredMaxError) return null;
  
  return (
    <div className="flex justify-between text-xs mt-1">
      {filteredMinError && (
        <p id={minErrorId} className="text-red-500" role="alert">
          {filteredMinError}
        </p>
      )}
      {filteredMaxError && (
        <p id={maxErrorId} className="text-red-500 ml-auto" role="alert">
          {filteredMaxError}
        </p>
      )}
    </div>
  );
};

export default React.memo(RangeErrorMessages);
