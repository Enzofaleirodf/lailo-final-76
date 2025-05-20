
import React from 'react';

interface RangeErrorMessagesProps {
  minError: string | null;
  maxError: string | null;
  minErrorId: string;
  maxErrorId: string;
}

/**
 * Componente para exibir mensagens de erro para campos de intervalo
 */
const RangeErrorMessages: React.FC<RangeErrorMessagesProps> = ({
  minError,
  maxError,
  minErrorId,
  maxErrorId
}) => {
  if (!minError && !maxError) return null;
  
  return (
    <div className="flex justify-between text-xs">
      {minError && (
        <p id={minErrorId} className="text-red-500" role="alert">
          {minError}
        </p>
      )}
      {maxError && (
        <p id={maxErrorId} className="text-red-500 ml-auto" role="alert">
          {maxError}
        </p>
      )}
    </div>
  );
};

export default React.memo(RangeErrorMessages);
