
import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/stores/useFilterStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilterBadge, generateFilterBadges } from './utils/filterBadgeUtils';

/**
 * ActiveFilterBadges - Displays active filters as removable badges
 * Maintains visual and behavioral consistency between desktop and mobile views
 */
const ActiveFilterBadges: React.FC = () => {
  const { filters, updateFilter, resetFilters } = useFilterStore();
  const isMobile = useIsMobile();
  
  // Generate badge list memoized for performance
  const badges = useMemo(() => 
    generateFilterBadges(filters, updateFilter),
  [filters, updateFilter]);
  
  // Don't render anything if no filters are active
  if (badges.length === 0) {
    return null;
  }
  
  // Consistent badge styling between desktop and mobile
  const badgeClasses = "flex items-center gap-1 px-2 py-1 bg-brand-50 border-brand-200 text-brand-800";
  
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
            aria-label={`Remover filtro ${badge.label}`}
          >
            <X size={10} className="text-brand-800" />
          </Button>
        </Badge>
      ))}
      
      {badges.length > 1 && (
        <Button
          variant="ghost"
          size="sm" 
          className="text-xs text-brand-700 hover:text-brand-800 hover:bg-brand-100 h-6"
          onClick={resetFilters}
          aria-label="Limpar todos os filtros"
        >
          Limpar todos
        </Button>
      )}
    </div>
  );
};

export default React.memo(ActiveFilterBadges);
