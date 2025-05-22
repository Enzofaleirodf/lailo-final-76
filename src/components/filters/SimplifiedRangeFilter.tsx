
import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { formatNumber } from '@/lib/utils';
import { RangeValues } from '@/hooks/useRangeFilter';

interface FormatterOptions {
  useThousandSeparator: boolean;
  formatDisplay: boolean;
}

// Adicionar isActive à interface de propriedades
interface SimplifiedRangeFilterProps {
  initialValues: RangeValues;
  defaultValues: RangeValues;
  onChange: (values: RangeValues) => void;
  minPlaceholder: string;
  maxPlaceholder: string;
  ariaLabelMin: string;
  ariaLabelMax: string;
  allowDecimals: boolean;
  minAllowed: number;
  maxAllowed: number;
  inputPrefix?: string;
  inputSuffix?: string;
  isActive?: boolean;
  formatterOptions: FormatterOptions;
  id?: string;
}

const SimplifiedRangeFilter: React.FC<SimplifiedRangeFilterProps> = ({
  initialValues,
  defaultValues,
  onChange,
  minPlaceholder,
  maxPlaceholder,
  ariaLabelMin,
  ariaLabelMax,
  allowDecimals,
  minAllowed,
  maxAllowed,
  inputPrefix = '',
  inputSuffix = '',
  isActive = false,
  formatterOptions,
  id
}) => {
  const [minValue, setMinValue] = useState<string>(initialValues.min || '');
  const [maxValue, setMaxValue] = useState<string>(initialValues.max || '');

  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinValue(value);
    
    const parsedValue = value === '' ? '' : value;
    onChange({ min: parsedValue, max: maxValue });
  }, [maxValue, onChange]);

  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxValue(value);
    
    const parsedValue = value === '' ? '' : value;
    onChange({ min: minValue, max: parsedValue });
  }, [minValue, onChange]);

  return (
    <div className="flex items-center gap-2" role="group" aria-label={`Intervalo de ${ariaLabelMin.split(' ')[0]}`}>
      <div className={`flex-1 flex items-center border rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-brand-300 ${isActive ? 'border-purple-300' : 'border-gray-200'}`}>
        {inputPrefix && <span className="text-gray-500 mr-2">{inputPrefix}</span>}
        <Input
          type="text"
          id={id ? `${id}-min` : undefined}
          placeholder={minPlaceholder}
          aria-label={ariaLabelMin}
          value={minValue}
          onChange={handleMinChange}
          className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-transparent p-0 m-0"
        />
        {inputSuffix && <span className="text-gray-500 ml-2">{inputSuffix}</span>}
      </div>
      <span className="text-gray-500">até</span>
      <div className={`flex-1 flex items-center border rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-brand-300 ${isActive ? 'border-purple-300' : 'border-gray-200'}`}>
        {inputPrefix && <span className="text-gray-500 mr-2">{inputPrefix}</span>}
        <Input
          type="text"
          id={id ? `${id}-max` : undefined}
          placeholder={maxPlaceholder}
          aria-label={ariaLabelMax}
          value={maxValue}
          onChange={handleMaxChange}
          className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-transparent p-0 m-0"
        />
        {inputSuffix && <span className="text-gray-500 ml-2">{inputSuffix}</span>}
      </div>
    </div>
  );
};

export default SimplifiedRangeFilter;
