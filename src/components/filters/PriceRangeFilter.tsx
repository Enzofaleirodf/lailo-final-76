
import React, { useCallback, useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import FilterRangeInput from './FilterRangeInput';
import { useFilterStore } from '@/stores/useFilterStore';
import { useQuery } from '@tanstack/react-query';
import { fetchSampleAuctions } from '@/data/sampleAuctions';
import { formatCurrency } from '@/utils/auctionUtils';
import { toast } from '@/components/ui/sonner';

interface PriceRangeFilterProps {
  onFilterChange?: () => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ onFilterChange }) => {
  const { filters, updateFilter } = useFilterStore();
  const { value, range } = filters.price;
  const [hasAdjustedPrice, setHasAdjustedPrice] = useState(false);
  
  // Fetch auction data to find min/max prices
  const { data: auctions } = useQuery({
    queryKey: ['auctions'],
    queryFn: fetchSampleAuctions
  });
  
  // Calculate min and max prices from the auctions data
  const { minPrice, maxPrice, priceSteps } = React.useMemo(() => {
    if (!auctions || auctions.length === 0) {
      return { minPrice: 0, maxPrice: 100000, priceSteps: 100 };
    }
    
    let dataToUse = auctions;
    
    // If on properties view, adjust price range based on content type
    if (filters.contentType === 'property') {
      const propertyPrices = dataToUse
        .filter(auction => !auction.vehicleInfo)
        .map(auction => auction.currentBid);
      
      if (propertyPrices.length > 0) {
        const min = Math.min(...propertyPrices);
        const max = Math.max(...propertyPrices);
        return {
          minPrice: min,
          maxPrice: max,
          priceSteps: Math.ceil((max - min) / 100) // 100 steps for the slider
        };
      }
    } else {
      // For vehicles, use the vehicle data
      const vehiclePrices = dataToUse
        .filter(auction => auction.vehicleInfo)
        .map(auction => auction.currentBid);
      
      if (vehiclePrices.length > 0) {
        const min = Math.min(...vehiclePrices);
        const max = Math.max(...vehiclePrices);
        return {
          minPrice: min,
          maxPrice: max,
          priceSteps: Math.ceil((max - min) / 100) // 100 steps for the slider
        };
      }
    }
    
    // Default fallback
    const prices = dataToUse.map(auction => auction.currentBid);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return {
      minPrice: min,
      maxPrice: max,
      priceSteps: Math.ceil((max - min) / 100) // 100 steps for the slider
    };
  }, [auctions, filters.contentType]);
  
  // Initialize the filter with the min/max values if they're empty
  useEffect(() => {
    if ((!range.min || !range.max) && auctions && auctions.length > 0) {
      updateFilter('price', {
        value: [minPrice, maxPrice],
        range: {
          min: range.min || String(minPrice),
          max: range.max || String(maxPrice)
        }
      });
    }
    
    // Check if the current range is outside the available data range and adjust if needed
    // Only do this once per content type change to avoid continuous adjustments
    if (auctions && auctions.length > 0 && !hasAdjustedPrice && 
        filters.price.range.max && Number(filters.price.range.max) > maxPrice * 1.5) {
      
      toast({
        title: "Faixa de preço ajustada",
        description: "Ajustamos a faixa de preço com base nos itens disponíveis."
      });
      
      updateFilter('price', {
        value: [minPrice, maxPrice],
        range: {
          min: String(minPrice),
          max: String(maxPrice)
        }
      });
      setHasAdjustedPrice(true);
    }
  }, [auctions, minPrice, maxPrice, range.min, range.max, updateFilter, filters.price.range.max, hasAdjustedPrice, filters.contentType]);

  // Reset the adjustment flag when content type changes
  useEffect(() => {
    setHasAdjustedPrice(false);
  }, [filters.contentType]);

  // Convert slider values to price values
  const sliderToPriceValue = (sliderValue: number): number => {
    return minPrice + (sliderValue * (maxPrice - minPrice) / 100);
  };
  
  // Convert price values to slider values (0-100)
  const priceToSliderValue = (priceValue: number): number => {
    return ((priceValue - minPrice) / (maxPrice - minPrice)) * 100;
  };

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
      });
      
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
    });
    
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
    });
    
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
