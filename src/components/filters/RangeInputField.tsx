
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface RangeInputFieldProps {
  id: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  isError?: boolean;
  isActive?: boolean;
  inputSuffix?: string;
  inputPrefix?: string;
  className?: string;
}

/**
 * Componente base para campos de entrada de filtros de intervalo
 * Simplificação dos componentes anteriores com foco em consistência visual
 */
const RangeInputField: React.FC<RangeInputFieldProps> = ({
  id,
  value,
  placeholder,
  onChange,
  onKeyDown,
  ariaLabel,
  ariaInvalid,
  ariaDescribedBy,
  isError = false,
  isActive = false,
  inputSuffix,
  inputPrefix,
  className = ""
}) => {
  // Calcular padding para acomodar prefixo/sufixo sem sobreposição
  const prefixPaddingClass = inputPrefix ? "pl-8" : "";
  const suffixPaddingClass = inputSuffix ? "pr-8" : "";
  
  return (
    <div className={cn("relative w-full", className)}>
      <Input 
        type="text" 
        id={id}
        placeholder={placeholder}
        className={cn(
          "h-10 text-sm w-full",
          prefixPaddingClass,
          suffixPaddingClass,
          isError 
            ? "border-red-300 focus-visible:ring-red-500" 
            : isActive 
              ? "border-brand-300 focus-visible:ring-brand-500" 
              : "border-gray-300 focus-visible:ring-brand-500"
        )}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        inputMode="numeric"
        pattern={/[0-9]*[.,]?[0-9]*/.source}
      />
      
      {/* Input prefix (e.g., currency symbol) */}
      {inputPrefix && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500 text-sm font-medium">{inputPrefix}</span>
        </div>
      )}
      
      {/* Input suffix (e.g., unit) */}
      {inputSuffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 text-sm">{inputSuffix}</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(RangeInputField);
