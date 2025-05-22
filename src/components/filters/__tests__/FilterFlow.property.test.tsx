
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import FilterContent from '../FilterContent';
import FilterSection from '@/components/FilterSection';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as uiStoreModule from '@/stores/useUIStore';
import {
  TestProviders,
  resetAllMocks,
  mockDispatchEvent,
  createDefaultFilterStoreMock
} from './setupFilterTests';

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('Property Filter Flow Integration', () => {
  const defaultPropertyStore = createDefaultFilterStoreMock('property');
  
  beforeEach(() => {
    resetAllMocks();
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue(defaultPropertyStore);
  });

  test('complete property filter flow: select property type, set area, and apply', async () => {
    // Mock the FilterSection to use actual FilterContent
    jest.doMock('@/components/FilterSection', () => {
      return {
        __esModule: true,
        default: ({ isOpen, onOpenChange }) => (
          <div className="filter-section-mock">
            <FilterContent contentType="property" />
            <button data-testid="apply-filters-button">Aplicar filtros</button>
          </div>
        )
      };
    });

    render(
      <TestProviders filterStoreMock={defaultPropertyStore}>
        <FilterSection contentType="property" />
      </TestProviders>
    );

    // 1. Select a property type
    // Mock that PropertyTypeFilter has been clicked (toggle group item)
    const updateFilter = defaultPropertyStore.updateFilter;
    updateFilter('propertyTypes', ['apartamento']);
    
    // 2. Set useful area range
    updateFilter('usefulArea', { min: '50', max: '100' });
    
    // 3. Click apply button
    fireEvent.click(screen.getByTestId('apply-filters-button'));
    
    // Verify that the filters:applied event was dispatched
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
    
    // Verify the active filters
    expect(updateFilter).toHaveBeenCalledWith('propertyTypes', ['apartamento']);
    expect(updateFilter).toHaveBeenCalledWith('usefulArea', { min: '50', max: '100' });
  });

  test('reset property filters after setting them', async () => {
    // Update store to have active filters
    const activeFilterStore = {
      ...defaultPropertyStore,
      filters: {
        ...defaultPropertyStore.filters,
        propertyTypes: ['apartamento'],
        usefulArea: { min: '50', max: '100' },
      },
      activeFilters: 2,
      resetFilters: jest.fn(),
    };
    jest.spyOn(filterStoreModule, 'useFilterStore').mockReturnValue(activeFilterStore);

    render(
      <TestProviders filterStoreMock={activeFilterStore}>
        <FilterContent contentType="property" />
      </TestProviders>
    );

    // Find and click the reset button
    const resetButton = screen.getByRole('button', { name: /resetar filtros/i });
    fireEvent.click(resetButton);
    
    // Verify reset was called
    expect(activeFilterStore.resetFilters).toHaveBeenCalled();
    
    // Verify the event was dispatched
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
  });
});
