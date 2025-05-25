
import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AccessibleInputProps {
  id: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  autoComplete?: string;
  ariaDescribedBy?: string;
}

/**
 * Input acessível com label, erro e texto de ajuda integrados
 */
const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  required = false,
  error,
  helpText,
  className,
  autoComplete,
  ariaDescribedBy
}, ref) => {
  const errorId = error ? `${id}-error` : undefined;
  const helpId = helpText ? `${id}-help` : undefined;
  const describedBy = [ariaDescribedBy, errorId, helpId].filter(Boolean).join(' ');

  return (
    <div className={cn('space-y-2', className)}>
      <Label 
        htmlFor={id}
        className={cn(
          'text-sm font-medium',
          required && "after:content-['*'] after:ml-0.5 after:text-red-500",
          disabled && 'text-gray-400'
        )}
      >
        {label}
      </Label>
      
      <Input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={describedBy || undefined}
        className={cn(
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          error && 'border-red-500 focus-visible:ring-red-500',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      />
      
      {helpText && (
        <p 
          id={helpId}
          className="text-sm text-gray-600"
          role="note"
        >
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
});

AccessibleInput.displayName = 'AccessibleInput';

export default AccessibleInput;
