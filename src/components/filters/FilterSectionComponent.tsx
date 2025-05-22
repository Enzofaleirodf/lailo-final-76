
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface FilterSectionComponentProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  testId?: string; // Adicionado para suportar testId
}

/**
 * Componente de seção de filtro otimizado
 * Versão melhorada com memoização para reduzir renderizações desnecessárias
 */
const FilterSectionComponent: React.FC<FilterSectionComponentProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
  testId
}) => {
  const id = `filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const isMobile = useIsMobile();

  // Handle section toggle without propagating event
  const handleToggle = (e: React.MouseEvent) => {
    // Stop propagation and prevent default to avoid URL changes
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <div 
      className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
      data-testid={testId}
    >
      {/* Title section - clickable for both desktop and mobile for consistent interaction */}
      <div className="w-full bg-gradient-to-r from-brand-50 to-white p-3">
        <h3 className="text-sm text-gray-900 font-urbanist font-semibold">{title}</h3>
      </div>
      
      {/* Content - sempre visível - sem mais acordeão */}
      <div id={id} role="region" aria-labelledby={`heading-${id}`} className="p-3">
        {children}
      </div>
    </div>
  );
};

// Usando memo para evitar renderizações desnecessárias
export default memo(FilterSectionComponent);
