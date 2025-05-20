
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/stores/useFilterStore';
import { formatCurrency, formatUsefulArea } from '@/utils/auctionUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilterState, PriceRangeFilter } from '@/types/filters';

const ActiveFilterBadges: React.FC = () => {
  const { filters, updateFilter, resetFilters } = useFilterStore();
  const isMobile = useIsMobile();
  
  const badges = [];
  
  // Location badge - only if state or city is set
  if (filters.location && (filters.location.state || filters.location.city)) {
    const locationText = [];
    if (filters.location.city) locationText.push(filters.location.city);
    if (filters.location.state) locationText.push(filters.location.state);
    
    badges.push({
      key: 'location',
      label: `Localização: ${locationText.join(', ')}`,
      onRemove: () => updateFilter('location', { state: '', city: '' })
    });
  }
  
  // Vehicle types badges - don't show if it's "todos" or empty
  if (filters.vehicleTypes.length > 0) {
    // Skip the "todos" option if present
    const nonDefaultTypes = filters.vehicleTypes.filter(type => type !== 'todos');
    
    if (nonDefaultTypes.length > 0) {
      nonDefaultTypes.forEach(type => {
        badges.push({
          key: `vehicle-${type}`,
          label: `Tipo: ${type}`,
          onRemove: () => {
            const updatedTypes = filters.vehicleTypes.filter(t => t !== type);
            updateFilter('vehicleTypes', updatedTypes);
          }
        });
      });
    }
  }
  
  // Property type badges - don't show if it's "todos" or empty
  if (filters.propertyTypes.length > 0) {
    // Skip the "todos" option if present
    const nonDefaultTypes = filters.propertyTypes.filter(type => type !== 'todos');
    
    if (nonDefaultTypes.length > 0) {
      nonDefaultTypes.forEach(type => {
        badges.push({
          key: `property-${type}`,
          label: `Tipo de imóvel: ${type}`,
          onRemove: () => {
            const updatedTypes = filters.propertyTypes.filter(t => t !== type);
            updateFilter('propertyTypes', updatedTypes);
          }
        });
      });
    }
  }
  
  // Useful area range badge - only if values are set
  if (filters.usefulArea.min || filters.usefulArea.max) {
    const minArea = filters.usefulArea.min ? parseInt(filters.usefulArea.min) : null;
    const maxArea = filters.usefulArea.max ? parseInt(filters.usefulArea.max) : null;
    
    const minLabel = minArea !== null ? formatUsefulArea(minArea) : '-';
    const maxLabel = maxArea !== null ? formatUsefulArea(maxArea) : '-';
    
    badges.push({
      key: 'usefulArea',
      label: `Área: ${minLabel} a ${maxLabel}`,
      onRemove: () => updateFilter('usefulArea', { min: '', max: '' })
    });
  }
  
  // Brand badge - only if not the default value
  if (filters.brand && filters.brand !== 'todas') {
    badges.push({
      key: 'brand',
      label: `Marca: ${filters.brand}`,
      onRemove: () => updateFilter('brand', 'todas')
    });
  }
  
  // Model badge - only if not the default value
  if (filters.model && filters.model !== 'todos') {
    badges.push({
      key: 'model',
      label: `Modelo: ${filters.model}`,
      onRemove: () => updateFilter('model', 'todos')
    });
  }
  
  // Color badge - only if not the default value
  if (filters.color && filters.color !== 'todas') {
    badges.push({
      key: 'color',
      label: `Cor: ${filters.color}`,
      onRemove: () => updateFilter('color', 'todas')
    });
  }
  
  // Year range badge - only if values are set
  if (filters.year.min || filters.year.max) {
    badges.push({
      key: 'year',
      label: `Ano: ${filters.year.min || '-'} a ${filters.year.max || '-'}`,
      onRemove: () => updateFilter('year', { min: '', max: '' })
    });
  }
  
  // Price range badge - only if values are set
  if (filters.price.range.min || filters.price.range.max) {
    const minPrice = filters.price.range.min ? parseInt(filters.price.range.min) : null;
    const maxPrice = filters.price.range.max ? parseInt(filters.price.range.max) : null;
    
    const minLabel = minPrice !== null ? formatCurrency(minPrice) : '-';
    const maxLabel = maxPrice !== null ? formatCurrency(maxPrice) : '-';
    
    badges.push({
      key: 'price',
      label: `Preço: ${minLabel} a ${maxLabel}`,
      onRemove: () => updateFilter('price', { 
        value: [0, 100],
        range: { min: '', max: '' }
      } as PriceRangeFilter)
    });
  }
  
  // Format badge - only if not default value
  if (filters.format && filters.format !== 'Todos') {
    badges.push({
      key: 'format',
      label: `Formato: ${filters.format}`,
      onRemove: () => updateFilter('format', 'Todos')
    });
  }
  
  // Origin badge - only if not default value
  if (filters.origin && filters.origin !== 'Todas') {
    badges.push({
      key: 'origin',
      label: `Origem: ${filters.origin}`,
      onRemove: () => updateFilter('origin', 'Todas')
    });
  }
  
  // Place badge - only if not default value
  if (filters.place && filters.place !== 'Todas') {
    badges.push({
      key: 'place',
      label: `Etapa: ${filters.place}`,
      onRemove: () => updateFilter('place', 'Todas')
    });
  }
  
  // If no active filters
  if (badges.length === 0) {
    return null;
  }
  
  const badgeClasses = "flex items-center gap-1 px-2 py-1 bg-brand-50 border-brand-200 text-brand-800";
  
  return (
    <div className="flex flex-wrap gap-2 mb-4 animate-fade-in">
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
