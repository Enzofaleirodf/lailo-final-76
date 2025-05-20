
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AccessibleRangeInputFieldProps {
  id: string;
  value: string;
  placeholder: string;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  ariaDescribedBy: string;
  isMin: boolean;
  inputSuffix?: string;
  inputPrefix?: string;
}

/**
 * Componente de campo de entrada para filtros de intervalo acessíveis
 * Encapsula um único campo (mínimo ou máximo) com todos os atributos ARIA necessários
 */
const AccessibleRangeInputField: React.FC<AccessibleRangeInputFieldProps> = ({
  id,
  value,
  placeholder,
  error,
  onChange,
  onKeyDown,
  ariaLabel,
  ariaDescribedBy,
  isMin,
  inputSuffix,
  inputPrefix
}) => {
  // Calcular o padding-left necessário para acomodar o prefixo sem sobreposição
  const prefixPaddingClass = inputPrefix ? "pl-9" : "";
  // Calcular o padding-right necessário para acomodar o sufixo sem sobreposição
  const suffixPaddingClass = inputSuffix ? "pr-9" : "";
  
  return (
    <div className="relative flex-1">
      <Input 
        type="text" 
        id={id}
        placeholder={placeholder}
        className={cn(
          "h-10 text-sm",
          prefixPaddingClass,
          suffixPaddingClass,
          error ? "border-red-300 focus-visible:ring-red-500" : "border-gray-300 focus-visible:ring-brand-500"
        )}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        inputMode="numeric"
        pattern="[0-9]*[.,]?[0-9]*"
      />
      <label htmlFor={id} className="sr-only">{ariaLabel}</label>
      
      {/* Input prefix (e.g., currency symbol) com melhor contraste e mais espaço */}
      {inputPrefix && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-600 text-sm font-medium select-none">{inputPrefix}</span>
        </div>
      )}
      
      {/* Input suffix (e.g., unit) com melhor contraste e mais espaço */}
      {inputSuffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-600 text-sm font-normal select-none">{inputSuffix}</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(AccessibleRangeInputField);
