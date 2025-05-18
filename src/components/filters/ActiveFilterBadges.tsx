
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/stores/useFilterStore';

const ActiveFilterBadges: React.FC = () => {
  const { filters, updateFilter, resetFilters } = useFilterStore();
  
  const badges = [];
  
  // Location badge
  if (filters.location) {
    badges.push({
      key: 'location',
      label: `Localização: ${filters.location}`,
      onRemove: () => updateFilter('location', '')
    });
  }
  
  // Vehicle types badges
  filters.vehicleTypes.forEach(type => {
    badges.push({
      key: `vehicle-${type}`,
      label: `Tipo: ${type}`,
      onRemove: () => updateFilter('vehicleTypes', filters.vehicleTypes.filter(t => t !== type))
    });
  });
  
  // Brand badge
  if (filters.brand && filters.brand !== 'todas') {
    badges.push({
      key: 'brand',
      label: `Marca: ${filters.brand}`,
      onRemove: () => updateFilter('brand', 'todas')
    });
  }
  
  // Model badge
  if (filters.model && filters.model !== 'todos') {
    badges.push({
      key: 'model',
      label: `Modelo: ${filters.model}`,
      onRemove: () => updateFilter('model', 'todos')
    });
  }
  
  // Color badge
  if (filters.color) {
    badges.push({
      key: 'color',
      label: `Cor: ${filters.color}`,
      onRemove: () => updateFilter('color', '')
    });
  }
  
  // Year range badge
  if (filters.year.min || filters.year.max) {
    badges.push({
      key: 'year',
      label: `Ano: ${filters.year.min || '-'} a ${filters.year.max || '-'}`,
      onRemove: () => updateFilter('year', { min: '', max: '' })
    });
  }
  
  // Price range badge
  if (filters.price.range.min || filters.price.range.max) {
    badges.push({
      key: 'price',
      label: `Preço: ${filters.price.range.min || '-'} a ${filters.price.range.max || '-'}`,
      onRemove: () => updateFilter('price', { 
        value: filters.price.value,
        range: { min: '', max: '' }
      })
    });
  }
  
  // If no active filters
  if (badges.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mb-4 animate-fade-in">
      {badges.map(badge => (
        <Badge 
          key={badge.key}
          variant="outline"
          className="flex items-center gap-1 px-2 py-1 bg-purple-50 border-purple-200 text-purple-800"
        >
          <span className="text-xs">{badge.label}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-purple-200 rounded-full flex items-center justify-center"
            onClick={badge.onRemove}
            aria-label={`Remover filtro ${badge.label}`}
          >
            <X size={10} className="text-purple-800" />
          </Button>
        </Badge>
      ))}
      
      {badges.length > 1 && (
        <Button
          variant="ghost"
          size="sm" 
          className="text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-100 h-6"
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
