
import React, { useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';

const PriceRangeFilter: React.FC = () => {
  const { filters, updateFilter } = useFilterStore();
  const { value, range } = filters.price;

  const handleSliderChange = useCallback((newValue: number[]) => {
    updateFilter('price', {
      value: newValue,
      range: filters.price.range
    });
  }, [filters.price.range, updateFilter]);

  const handleMinChange = useCallback((minValue: string) => {
    updateFilter('price', {
      value: filters.price.value,
      range: {
        ...filters.price.range,
        min: minValue
      }
    });
  }, [filters.price.value, filters.price.range, updateFilter]);

  const handleMaxChange = useCallback((maxValue: string) => {
    updateFilter('price', {
      value: filters.price.value,
      range: {
        ...filters.price.range,
        max: maxValue
      }
    });
  }, [filters.price.value, filters.price.range, updateFilter]);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Slider 
          value={value} 
          onValueChange={handleSliderChange} 
          max={100} 
          step={1} 
          className="my-4" 
          aria-label="Ajustar valor do lance"
        />
      </div>
      <FilterRangeInput
        minValue={range.min}
        maxValue={range.max}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
        minPlaceholder="Mínimo"
        maxPlaceholder="Máximo"
        ariaLabelMin="Valor mínimo do lance"
        ariaLabelMax="Valor máximo do lance"
      />
    </div>
  );
};

export default React.memo(PriceRangeFilter);
