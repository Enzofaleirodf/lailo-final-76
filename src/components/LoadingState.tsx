
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

/**
 * Componente de estado de carregamento otimizado
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'md',
  text = 'Carregando...',
  className = '',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = cn(
    'flex flex-col items-center justify-center gap-3',
    fullScreen ? 'min-h-screen' : 'min-h-[200px]',
    className
  );

  return (
    <div 
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <Loader2 
        className={cn(
          'animate-spin text-brand-600',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {text && (
        <p className={cn(
          'text-gray-600 font-medium',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
      <span className="sr-only">{text}</span>
    </div>
  );
};

export default React.memo(LoadingState);
