
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

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
 * Refatorado para usar classes CSS em vez de estilos inline
 * Otimizado com debounce e requestAnimationFrame
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
  const animationFrameRef = useRef<number | null>(null);
  const [paddingClasses, setPaddingClasses] = useState({
    prefix: inputPrefix ? 'pl-10' : '',
    suffix: inputSuffix ? 'pr-10' : ''
  });
  
  // Usar debounce para evitar cálculos excessivos
  const updatePaddingClasses = useDebouncedCallback(() => {
    if (!inputRef.current) return;
    
    // Cancelar qualquer animationFrame pendente
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Usar requestAnimationFrame para cálculos de layout
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!inputRef.current) return;
      
      const prefixLength = inputPrefix?.length || 0;
      const suffixLength = inputSuffix?.length || 0;
      
      // Usar classes tailwind em vez de estilos inline
      const prefixClass = prefixLength > 2 ? 'pl-16' : prefixLength > 0 ? 'pl-10' : '';
      const suffixClass = suffixLength > 2 ? 'pr-16' : suffixLength > 0 ? 'pr-10' : '';
      
      setPaddingClasses({
        prefix: prefixClass,
        suffix: suffixClass
      });
    });
  }, 100);
  
  // Atualizar padding quando o componente monta ou quando prefix/suffix mudam
  useEffect(() => {
    updatePaddingClasses();
    
    // Limpar animationFrame quando o componente desmontar
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [inputPrefix, inputSuffix, updatePaddingClasses]);
  
  // Definir estilos condicionais
  const getBorderStyle = () => {
    if (isError) return 'border-red-500 focus-visible:ring-red-500';
    if (isFocused) return 'border-brand-500 focus-visible:ring-brand-500';
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
          <span className="text-gray-500 select-none">{inputPrefix}</span>
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
          paddingClasses.prefix,
          paddingClasses.suffix,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
        )}
      />
      
      {/* Sufixo com espaçamento adequado */}
      {inputSuffix && (
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-gray-500 select-none">{inputSuffix}</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(RangeInputField);
