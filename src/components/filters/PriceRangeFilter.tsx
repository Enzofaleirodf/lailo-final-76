
import React from 'react';
import { Slider } from '@/components/ui/slider';
import FilterRangeInput from './FilterRangeInput';
import { useFilter } from '@/contexts/FilterContext';

const PriceRangeFilter: React.FC = () => {
  const { filters, updateFilter } = useFilter();
  const { value, range } = filters.price;

  const handleSliderChange = (newValue: number[]) => {
    updateFilter('price', {
      value: newValue,
      range: filters.price.range
    });
  };

  const handleMinChange = (minValue: string) => {
    updateFilter('price', {
      value: filters.price.value,
      range: {
        ...filters.price.range,
        min: minValue
      }
    });
  };

  const handleMaxChange = (maxValue: string) => {
    updateFilter('price', {
      value: filters.price.value,
      range: {
        ...filters.price.range,
        max: maxValue
      }
    });
  };

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

export default PriceRangeFilter;
