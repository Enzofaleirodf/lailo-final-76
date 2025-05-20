
import React, { useEffect, useState } from 'react';

interface RangeErrorMessagesProps {
  minError: string | null;
  maxError: string | null;
  minErrorId: string;
  maxErrorId: string;
}

/**
 * Componente para exibir mensagens de erro para campos de intervalo
 * Não exibe mensagens de limite mínimo/máximo após o blur
 */
const RangeErrorMessages: React.FC<RangeErrorMessagesProps> = ({
  minError,
  maxError,
  minErrorId,
  maxErrorId
}) => {
  // Filtra mensagens de erro para não mostrar limites após o blur
  const filteredMinError = minError && !minError.startsWith('Mín:') ? minError : null;
  const filteredMaxError = maxError && !maxError.startsWith('Máx:') ? maxError : null;
  
  if (!filteredMinError && !filteredMaxError) return null;
  
  return (
    <div className="flex justify-between text-xs">
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
