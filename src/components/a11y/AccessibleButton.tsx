
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  role?: string;
  tabIndex?: number;
}

/**
 * Botão acessível que implementa todas as melhores práticas de acessibilidade
 */
const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  className,
  type = 'button',
  role = 'button',
  tabIndex = 0
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  useKeyboardNavigation({
    onEnter: handleClick,
    onSpace: handleClick,
    preventDefault: ['Enter', ' ']
  }, [handleClick]);

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      type={type}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={disabled ? -1 : tabIndex}
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'transition-all duration-200',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default AccessibleButton;
