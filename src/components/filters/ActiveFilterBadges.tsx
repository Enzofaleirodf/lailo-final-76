
import React, { useMemo, useCallback } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/stores/useFilterStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilterBadge, generateFilterBadges } from './utils/filterBadgeUtils';

/**
 * ActiveFilterBadges - Exibe filtros ativos como badges removíveis
 * Mantém consistência visual e comportamental entre visualizações desktop e mobile
 */
const ActiveFilterBadges: React.FC = () => {
  const { filters, updateFilter, resetFilters } = useFilterStore();
  const isMobile = useIsMobile();
  
  // Gerar lista de badges memorizada para performance
  const badges = useMemo(() => 
    generateFilterBadges(filters, updateFilter),
  [filters, updateFilter]);
  
  // Manipulador para limpar todos os filtros
  const handleClearAll = useCallback(() => {
    resetFilters();
    // Acionar evento filters:applied para notificar que os filtros foram alterados
    window.dispatchEvent(new CustomEvent('filters:applied'));
  }, [resetFilters]);

  // Manipulador para eventos de teclado - acessibilidade
  const handleKeyDown = useCallback((e: React.KeyboardEvent, onRemove: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRemove();
    }
  }, []);
  
  // Não renderizar nada se não houver filtros ativos
  if (badges.length === 0) {
    return null;
  }
  
  // Estilo de badge consistente entre desktop e mobile
  const badgeClasses = "flex items-center gap-1 px-2 py-1 bg-brand-50 border-brand-200 text-gray-800";
  
  return (
    <div 
      className="flex flex-wrap gap-2 mb-4 animate-fade-in"
      role="region"
      aria-label="Filtros ativos"
    >
      {badges.map(badge => (
        <Badge 
          key={badge.key}
          variant="outline"
          className={badgeClasses}
        >
          <span className="text-xs">{badge.label}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-brand-200 rounded-full flex items-center justify-center"
            onClick={badge.onRemove}
            onKeyDown={(e) => handleKeyDown(e, badge.onRemove)}
            aria-label={`Remover filtro ${badge.label}`}
            tabIndex={0}
          >
            <X size={10} className="text-gray-700" aria-hidden="true" />
          </Button>
        </Badge>
      ))}
      
      {badges.length > 1 && (
        <Button
          variant="ghost"
          size="sm" 
          className="text-xs text-gray-700 hover:text-gray-800 hover:bg-brand-100 h-6"
          onClick={handleClearAll}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClearAll();
            }
          }}
          aria-label="Limpar todos os filtros"
          tabIndex={0}
        >
          Limpar todos
        </Button>
      )}
    </div>
  );
};

export default React.memo(ActiveFilterBadges);
