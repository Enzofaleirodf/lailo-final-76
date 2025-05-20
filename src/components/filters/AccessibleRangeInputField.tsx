
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
  inputSuffix
}) => {
  return (
    <div className="relative flex-1">
      <Input 
        type="text" 
        id={id}
        placeholder={placeholder}
        className={cn(
          "h-10 text-sm",
          error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-brand-500"
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
      {inputSuffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 text-sm">{inputSuffix}</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(AccessibleRangeInputField);
