
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface RangeInputFieldProps {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  ariaLabel: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  isError?: boolean;
  isActive?: boolean;
  inputPrefix?: string;
  inputSuffix?: string;
  className?: string;
  dataTestId?: string;
}

/**
 * Componente de campo de entrada para filtros de intervalo
 * Refatorado para garantir consistência visual entre desktop e mobile
 */
const RangeInputField: React.FC<RangeInputFieldProps> = ({
  id,
  value,
  placeholder = "",
  onChange,
  onBlur,
  ariaLabel,
  ariaInvalid = false,
  ariaDescribedBy,
  isError = false,
  isActive = false,
  inputPrefix,
  inputSuffix,
  className = "",
  dataTestId
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // Calcular tamanho adequado do campo para acomodar prefixo e sufixo
  const handleInputPadding = () => {
    if (inputRef.current) {
      if (inputPrefix) {
        inputRef.current.style.paddingLeft = `${inputPrefix.length * 0.75 + 1}em`;
      }
      
      if (inputSuffix) {
        inputRef.current.style.paddingRight = `${inputSuffix.length * 0.75 + 1}em`;
      }
    }
  };
  
  // Aplicar padding quando o componente monta e quando prefixo/sufixo muda
  useEffect(() => {
    handleInputPadding();
  }, [inputPrefix, inputSuffix]);
  
  // Definir estilos condicionais
  const getBorderStyle = () => {
    if (isError) return 'border-red-500 focus-visible:ring-red-500';
    if (isActive) return 'border-brand-600 focus-visible:ring-brand-500';
    return 'border-gray-300 focus-visible:ring-brand-500';
  };
  
  return (
    <div className={cn("relative", className)} data-testid={dataTestId || 'range-input-field'}>
      {/* Prefixo */}
      {inputPrefix && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500">{inputPrefix}</span>
        </div>
      )}
      
      {/* Campo de entrada */}
      <Input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "h-10 px-3 text-sm transition-colors bg-white", 
          getBorderStyle(),
          isFocused ? "border-brand-500" : "",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
        )}
      />
      
      {/* Sufixo */}
      {inputSuffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500">{inputSuffix}</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(RangeInputField);
