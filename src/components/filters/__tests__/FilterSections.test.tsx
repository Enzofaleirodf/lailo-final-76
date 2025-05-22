
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContentTypeFilters, CommonFilters } from '../sections/FilterSections';
import * as filterStoreModule from '@/stores/useFilterStore';

// Mock all required child components
jest.mock('../VehicleTypeFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="vehicle-type-filter">Vehicle Type Filter</div>
}));

jest.mock('../PropertyTypeFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="property-type-filter">Property Type Filter</div>
}));

jest.mock('../LocationFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="location-filter">Location Filter</div>
}));

jest.mock('../ModelFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="model-filter">Model Filter</div>
}));

jest.mock('../ColorFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="color-filter">Color Filter</div>
}));

jest.mock('../YearRangeFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="year-filter">Year Filter</div>
}));

jest.mock('../PriceRangeFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="price-filter">Price Filter</div>
}));

jest.mock('../UsefulAreaFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="useful-area-filter">Useful Area Filter</div>
}));

jest.mock('../CategoryFilter', () => ({
  __esModule: true,
  default: () => <div data-testid="category-filter">Category Filter</div>
}));

jest.mock('../FilterSectionComponent', () => ({
  __esModule: true,
  default: ({ children, title, isExpanded }: any) => (
    <div data-testid={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3>{title}</h3>
      {isExpanded && <div>{children}</div>}
    </div>
  )
}));

// Mock the filter store
const mockFilterStore = {
  filters: {
    contentType: 'property',
    category: 'Todos',
  },
  expandedSections: {
    location: true,
    vehicleType: false,
    propertyType: true,
    price: true,
    year: false,
    usefulArea: false,
    model: false,
    color: false,
    category: true,
  },
  toggleSection: jest.fn(),
};

// Mock the useFilterStore
jest.mock('@/stores/useFilterStore');

describe('FilterSections', () => {
  const mockOnFilterChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue(mockFilterStore);
  });
  
  describe('ContentTypeFilters', () => {
    it('renders category filter for all content types', () => {
      render(<ContentTypeFilters onFilterChange={mockOnFilterChange} contentType="property" />);
      
      expect(screen.getByText('Categoria')).toBeInTheDocument();
      expect(screen.getByTestId('category-filter')).toBeInTheDocument();
    });
    
    it('renders property filters when content type is property', () => {
      render(<ContentTypeFilters onFilterChange={mockOnFilterChange} contentType="property" />);
      
      expect(screen.getByText('Tipo de imóvel')).toBeInTheDocument();
      expect(screen.getByText('Área útil')).toBeInTheDocument();
      expect(screen.getByTestId('property-type-filter')).toBeInTheDocument();
      expect(screen.queryByTestId('vehicle-type-filter')).not.toBeInTheDocument();
    });
    
    it('renders vehicle filters when content type is vehicle', () => {
      // Override mock to return vehicle content type
      (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue({
        ...mockFilterStore,
        filters: { 
          contentType: 'vehicle', 
          category: 'Todos' 
        },
      });
      
      render(<ContentTypeFilters onFilterChange={mockOnFilterChange} contentType="vehicle" />);
      
      expect(screen.getByText('Categoria')).toBeInTheDocument();
      expect(screen.getByText('Tipo de veículo')).toBeInTheDocument();
      expect(screen.getByTestId('vehicle-type-filter')).toBeInTheDocument();
      expect(screen.queryByTestId('property-type-filter')).not.toBeInTheDocument();
    });
  });
  
  describe('CommonFilters', () => {
    it('renders common filter sections', () => {
      render(<CommonFilters onFilterChange={mockOnFilterChange} contentType="property" />);
      
      expect(screen.getByText('Localização')).toBeInTheDocument();
      expect(screen.getByText('Valor do lance')).toBeInTheDocument();
      expect(screen.getByTestId('location-filter')).toBeInTheDocument();
      expect(screen.getByTestId('price-filter')).toBeInTheDocument();
    });
    
    it('expands sections based on expandedSections state', () => {
      // Set location and price expanded
      (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue({
        ...mockFilterStore,
        expandedSections: {
          ...mockFilterStore.expandedSections,
          location: true,
          price: true,
        },
      });
      
      render(<CommonFilters onFilterChange={mockOnFilterChange} contentType="property" />);
      
      expect(screen.getByTestId('location-filter')).toBeInTheDocument();
      expect(screen.getByTestId('price-filter')).toBeInTheDocument();
    });
  });
});
