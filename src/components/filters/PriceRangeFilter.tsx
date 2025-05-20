
import React, { useCallback, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { useQuery } from '@tanstack/react-query';
import { fetchSampleAuctions } from '@/data/sampleAuctions';
import { formatCurrency } from '@/utils/auctionUtils';
import { toast } from '@/components/ui/use-toast';
import { PriceRangeFilter as PriceRangeFilterType } from '@/types/filters';

interface PriceRangeFilterProps {
  onFilterChange?: () => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { value, range } = filters.price;
  const [hasAdjustedPrice, setHasAdjustedPrice] = useState(false);
  const isPropertyMode = filters.contentType === 'property';
  
  // Fetch auction data to find min/max prices
  const { data: auctions } = useQuery({
    queryKey: ['auctions'],
    queryFn: fetchSampleAuctions
  });
  
  // Calculate min and max prices from the auctions data
  const { minPrice, maxPrice, priceSteps } = React.useMemo(() => {
    // Default fallbacks based on content type
    const defaultMaxPrice = isPropertyMode ? 1500000 : 100000;
    const defaultMinPrice = 0;
    
    if (!auctions || auctions.length === 0) {
      return { 
        minPrice: defaultMinPrice, 
        maxPrice: defaultMaxPrice, 
        priceSteps: isPropertyMode ? 1500 : 100
      };
    }
    
    // Filter data based on content type
    const relevantData = auctions.filter(auction => {
      if (isPropertyMode) {
        return !auction.vehicleInfo; // Properties don't have vehicleInfo
      } else {
        return auction.vehicleInfo; // Vehicles have vehicleInfo
      }
    });
    
    if (relevantData.length === 0) {
      return { 
        minPrice: defaultMinPrice, 
        maxPrice: defaultMaxPrice, 
        priceSteps: isPropertyMode ? 1500 : 100
      };
    }
    
    const prices = relevantData.map(item => item.currentBid);
    const min = Math.floor(Math.min(...prices) * 0.9); // 10% buffer below
    const max = Math.ceil(Math.max(...prices) * 1.1); // 10% buffer above
    
    return {
      minPrice: min,
      maxPrice: max,
      priceSteps: Math.ceil((max - min) / 100) // 100 steps for the slider
    };
  }, [auctions, isPropertyMode]);
  
  // Reset adjustment tracking when content type changes
  useEffect(() => {
    setHasAdjustedPrice(false);
  }, [filters.contentType]);
  
  // Initialize the filter with appropriate min/max values
  useEffect(() => {
    const shouldInitializeOrReset = (
      (!range.min && !range.max) || // Empty range
      (Number(range.max) > maxPrice * 1.5) || // Range is too high
      (Number(range.max) < maxPrice * 0.5)    // Range is too low
    );
    
    if (shouldInitializeOrReset && !hasAdjustedPrice) {
      // Show toast only if we're adjusting an existing range
      if (range.min || range.max) {
        toast({
          description: "Ajustamos a faixa de preço com base nos itens disponíveis."
        });
      }
      
      updateFilter('price', {
        value: [0, 100],
        range: {
          min: String(minPrice),
          max: String(maxPrice)
        }
      } as PriceRangeFilterType);
      setHasAdjustedPrice(true);
    }
  }, [minPrice, maxPrice, range.min, range.max, updateFilter, hasAdjustedPrice, filters.contentType]);

  // Convert slider values to price values
  const sliderToPriceValue = useCallback((sliderValue: number): number => {
    return minPrice + (sliderValue * (maxPrice - minPrice) / 100);
  }, [minPrice, maxPrice]);
  
  // Convert price values to slider values (0-100)
  const priceToSliderValue = useCallback((priceValue: number): number => {
    return ((priceValue - minPrice) / (maxPrice - minPrice)) * 100;
  }, [minPrice, maxPrice]);

  const handleSliderChange = useCallback((newValue: number[]) => {
    if (newValue.length === 2) {
      const minPrice = sliderToPriceValue(newValue[0]);
      const maxPrice = sliderToPriceValue(newValue[1]);
      
      updateFilter('price', {
        value: newValue,
        range: {
          min: String(Math.round(minPrice)),
          max: String(Math.round(maxPrice))
        }
      } as PriceRangeFilterType);
      
      // Notify parent component that filter has changed
      if (onFilterChange) {
        onFilterChange();
      }
    }
  }, [updateFilter, onFilterChange, sliderToPriceValue]);

  const handleMinChange = useCallback((minValue: string) => {
    const numericValue = minValue === '' ? minPrice : Number(minValue);
    const sliderValue = priceToSliderValue(numericValue);
    
    updateFilter('price', {
      value: [sliderValue, value[1] || 100],
      range: {
        ...filters.price.range,
        min: minValue
      }
    } as PriceRangeFilterType);
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.price.range, value, minPrice, priceToSliderValue, updateFilter, onFilterChange]);

  const handleMaxChange = useCallback((maxValue: string) => {
    const numericValue = maxValue === '' ? maxPrice : Number(maxValue);
    const sliderValue = priceToSliderValue(numericValue);
    
    updateFilter('price', {
      value: [value[0] || 0, sliderValue],
      range: {
        ...filters.price.range,
        max: maxValue
      }
    } as PriceRangeFilterType);
    
    // Notify parent component that filter has changed
    if (onFilterChange) {
      onFilterChange();
    }
  }, [filters.price.range, value, maxPrice, priceToSliderValue, updateFilter, onFilterChange]);

  // Ensure we always have two values for the slider
  const sliderValues = value.length === 2 
    ? value 
    : [value[0] || 0, value[0] === 100 ? 100 : (value[0] || 0) + 50];

  // Format min and max placeholders
  const formatMinPlaceholder = () => {
    return formatCurrency(minPrice).replace('R$', '');
  };
  
  const formatMaxPlaceholder = () => {
    return formatCurrency(maxPrice).replace('R$', '');
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Slider 
          value={sliderValues} 
          onValueChange={handleSliderChange} 
          min={0}
          max={100}
          step={1} 
          className="my-4" 
          aria-label="Ajustar intervalo de preço"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatCurrency(sliderToPriceValue(sliderValues[0]))}</span>
          <span>{formatCurrency(sliderToPriceValue(sliderValues[1]))}</span>
        </div>
        <FilterRangeInput
          minValue={range.min}
          maxValue={range.max}
          onMinChange={handleMinChange}
          onMaxChange={handleMaxChange}
          minPlaceholder={formatMinPlaceholder()}
          maxPlaceholder={formatMaxPlaceholder()}
          ariaLabelMin="Valor mínimo do lance"
          ariaLabelMax="Valor máximo do lance"
        />
      </div>
    </div>
  );
};

export default React.memo(PriceRangeFilter);
