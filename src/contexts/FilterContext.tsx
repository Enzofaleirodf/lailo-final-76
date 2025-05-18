
import React, { createContext, useContext, useState, useMemo } from 'react';

// Define all filter types
export type VehicleType = 'car' | 'motorcycle' | 'truck' | 'other';
export type FilterFormat = 'Leilão' | 'Venda Direta';
export type FilterOrigin = 'Todas' | 'Judicial' | 'Extrajudicial';
export type FilterPlace = 'Todas' | 'Primeira' | 'Segunda';
export type ContentType = 'property' | 'vehicle';

export interface PriceRange {
  min: string;
  max: string;
}

export interface YearRange {
  min: string;
  max: string;
}

// Define the filter state interface
export interface FilterState {
  contentType: ContentType;
  location: string;
  vehicleTypes: string[];
  brand: string;
  model: string;
  color: string;
  year: YearRange;
  price: {
    value: number[];
    range: PriceRange;
  };
  format: FilterFormat;
  origin: FilterOrigin;
  place: FilterPlace;
}

// Define the filter context interface
interface FilterContextType {
  filters: FilterState;
  expandedSections: Record<string, boolean>;
  activeFilters: number; // New property to track number of active filters
  setFilters: (filters: FilterState) => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  toggleSection: (section: string) => void;
}

// Default filter values
export const DEFAULT_FILTERS: FilterState = {
  contentType: 'vehicle',
  location: '',
  vehicleTypes: [],
  brand: 'todas',
  model: 'todos',
  color: '',
  year: { min: '', max: '' },
  price: {
    value: [30],
    range: { min: '', max: '' }
  },
  format: 'Leilão',
  origin: 'Todas',
  place: 'Todas'
};

// Create the context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    vehicleType: true,
    model: true,
    color: true,
    year: true,
    price: true
  });

  // Function to update a specific filter
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Function to reset all filters
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Function to toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate number of active filters
  const activeFilters = useMemo(() => {
    let count = 0;
    
    if (filters.location) count++;
    if (filters.vehicleTypes.length > 0) count++;
    if (filters.brand && filters.brand !== 'todas') count++;
    if (filters.model && filters.model !== 'todos') count++;
    if (filters.color) count++;
    if (filters.year.min || filters.year.max) count++;
    if (filters.price.range.min || filters.price.range.max) count++;
    if (filters.format !== DEFAULT_FILTERS.format) count++;
    if (filters.origin !== DEFAULT_FILTERS.origin) count++;
    if (filters.place !== DEFAULT_FILTERS.place) count++;
    
    return count;
  }, [filters]);

  const value = useMemo(() => ({
    filters,
    expandedSections,
    activeFilters,
    setFilters,
    updateFilter,
    resetFilters,
    toggleSection
  }), [filters, expandedSections, activeFilters]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

// Hook to use the filter context
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
