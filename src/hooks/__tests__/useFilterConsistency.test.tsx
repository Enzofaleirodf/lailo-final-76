
import { renderHook, act } from '@testing-library/react';
import { useFilterConsistency } from '../useFilterConsistency';
import { useFilterStore } from '@/stores/useFilterStore';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/stores/useFilterStore');
jest.mock('@/hooks/use-toast');
jest.mock('@/utils/filterUtils', () => ({
  getFilterName: jest.fn().mockReturnValue('Teste'),
  getFilterDescription: jest.fn().mockReturnValue('Descrição do filtro'),
}));

describe('useFilterConsistency', () => {
  // Setup default mocks
  const mockToast = jest.fn();
  const mockUpdateFilter = jest.fn();
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock return values
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (useFilterStore as jest.Mock).mockReturnValue({
      filters: { test: 'value' },
      lastUpdatedFilter: 'test',
      updateFilter: mockUpdateFilter,
    });
    
    // Mock window methods
    // @ts-ignore
    window.dispatchEvent = jest.fn();
    
    // Mock setTimeout
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call onChange when handleFilterChange is called', () => {
    const { result } = renderHook(() => 
      useFilterConsistency({ onChange: mockOnChange })
    );
    
    act(() => {
      result.current.handleFilterChange();
    });
    
    expect(mockOnChange).toHaveBeenCalled();
  });
  
  it('should dispatch filters:applied event when autoTriggerEvents is true', () => {
    const { result } = renderHook(() => 
      useFilterConsistency({ autoTriggerEvents: true })
    );
    
    act(() => {
      result.current.handleFilterChange();
      jest.runAllTimers();
    });
    
    expect(window.dispatchEvent).toHaveBeenCalled();
    const callArgs = (window.dispatchEvent as jest.Mock).mock.calls[0][0];
    expect(callArgs.type).toBe('filters:applied');
  });
  
  it('should not dispatch event when autoTriggerEvents is false', () => {
    const { result } = renderHook(() => 
      useFilterConsistency({ autoTriggerEvents: false })
    );
    
    act(() => {
      result.current.handleFilterChange();
      jest.runAllTimers();
    });
    
    expect(window.dispatchEvent).not.toHaveBeenCalled();
  });
  
  it('should show toast when filter is updated and showToasts is true', () => {
    renderHook(() => 
      useFilterConsistency({ showToasts: true })
    );
    
    // Check if toast was called with the correct arguments
    expect(mockToast).toHaveBeenCalled();
    expect(mockToast.mock.calls[0][0].title).toContain('Filtro');
  });
  
  it('should not show toast when showToasts is false', () => {
    renderHook(() => 
      useFilterConsistency({ showToasts: false })
    );
    
    expect(mockToast).not.toHaveBeenCalled();
  });
  
  it('should show reset notification when lastUpdatedFilter is reset', () => {
    // Override lastUpdatedFilter to be 'reset'
    (useFilterStore as jest.Mock).mockReturnValue({
      filters: {},
      lastUpdatedFilter: 'reset',
    });
    
    renderHook(() => 
      useFilterConsistency({ showToasts: true })
    );
    
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Filtros resetados"
    }));
  });
  
  it('should not show toast for bulk updates', () => {
    // Override lastUpdatedFilter to be 'bulk'
    (useFilterStore as jest.Mock).mockReturnValue({
      filters: {},
      lastUpdatedFilter: 'bulk',
    });
    
    renderHook(() => 
      useFilterConsistency({ showToasts: true })
    );
    
    expect(mockToast).not.toHaveBeenCalled();
  });
});
