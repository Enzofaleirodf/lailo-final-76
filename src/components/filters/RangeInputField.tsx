
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { measurePerformance } from '@/utils/performanceUtils';

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
 * Otimizado para desempenho com grandes conjuntos de dados
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
  
  // Performance tracking for padding calculation
  const paddingPerf = process.env.NODE_ENV === 'development' ? 
    measurePerformance('RangeInputField-padding') : null;
  
  // Calcular tamanho adequado do campo para acomodar prefixo e sufixo
  const handleInputPadding = () => {
    if (inputRef.current) {
      if (inputPrefix) {
        // Aumentar padding para evitar sobreposição do prefixo
        const prefixLength = inputPrefix.length;
        const basePadding = 22; // Aumentado para 22px
        const charWidth = 8; // Largura média aproximada de um caractere
        
        const calculatedPadding = basePadding + (prefixLength * charWidth);
        inputRef.current.style.paddingLeft = `${calculatedPadding}px`;
      }
      
      if (inputSuffix) {
        // Aumentar padding para evitar sobreposição do sufixo
        const suffixLength = inputSuffix.length;
        const basePadding = 22; // Aumentado para 22px
        const charWidth = 8;
        
        const calculatedPadding = basePadding + (suffixLength * charWidth);
        inputRef.current.style.paddingRight = `${calculatedPadding}px`;
      }
    }
    
    // Registrar desempenho
    if (paddingPerf) {
      paddingPerf.end();
    }
  };
  
  // Aplicar padding quando o componente monta e quando prefixo/sufixo muda
  useEffect(() => {
    handleInputPadding();
    
    // Reaplicar em resize para garantir consistência entre tamanhos de tela
    const handleResize = () => {
      handleInputPadding();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [inputPrefix, inputSuffix]);
  
  // Definir estilos condicionais
  const getBorderStyle = () => {
    if (isError) return 'border-red-500 focus-visible:ring-red-500';
    if (isFocused) return 'border-brand-500 focus-visible:ring-brand-500';
    if (isActive) return 'border-purple-300 focus-visible:ring-brand-500'; // Borda roxa para filtros ativos
    return 'border-gray-300 focus-visible:ring-brand-500';
  };
  
  return (
    <div 
      className={cn("relative", className)} 
      data-testid={dataTestId || 'range-input-field'}
    >
      {/* Prefixo com espaçamento adequado */}
      {inputPrefix && (
        <div 
          className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-gray-500 select-none mr-6">{inputPrefix}</span>
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
        )}
      />
      
      {/* Sufixo com espaçamento adequado */}
      {inputSuffix && (
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-gray-500 select-none ml-6">{inputSuffix}</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(RangeInputField);
