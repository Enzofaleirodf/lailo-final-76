
import { renderHook } from '@testing-library/react';
import { useFilterConsistency } from '../useFilterConsistency';
import * as filterStoreModule from '@/stores/useFilterStore';
import * as mobileHookModule from '@/hooks/use-mobile';
import * as toastModule from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/stores/useFilterStore');
jest.mock('@/hooks/use-mobile');
jest.mock('@/hooks/use-toast');
jest.mock('@/utils/filterUtils', () => ({
  getFilterName: jest.fn().mockImplementation((key) => key),
  getFilterDescription: jest.fn().mockImplementation((key, value) => JSON.stringify(value))
}));

describe('useFilterConsistency', () => {
  // Create mocks
  const mockToast = jest.fn();
  const mockDispatchEvent = jest.spyOn(window, 'dispatchEvent');
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the toast hook
    (toastModule.useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    // Mock isMobile
    (mobileHookModule.useIsMobile as jest.Mock).mockReturnValue(false);
    
    // Mock filter store with no updates
    (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue({
      filters: {},
      lastUpdatedFilter: null
    });
  });
  
  it('does nothing when lastUpdatedFilter is null', () => {
    renderHook(() => useFilterConsistency({ onChange: mockOnChange }));
    
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(mockDispatchEvent).not.toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalled();
  });
  
  it('does nothing when lastUpdatedFilter is "initial"', () => {
    (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue({
      filters: {},
      lastUpdatedFilter: 'initial'
    });
    
    renderHook(() => useFilterConsistency({ onChange: mockOnChange }));
    
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(mockDispatchEvent).not.toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalled();
  });
  
  it('calls onChange and dispatches event when filter changes', () => {
    (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue({
      filters: {
        location: { state: 'SP', city: 'São Paulo' }
      },
      lastUpdatedFilter: 'location'
    });
    
    renderHook(() => useFilterConsistency({ onChange: mockOnChange }));
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe('filters:applied');
  });
  
  it('supports receiving just a callback function', () => {
    (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue({
      filters: {
        format: 'Leilão'
      },
      lastUpdatedFilter: 'format'
    });
    
    renderHook(() => useFilterConsistency(mockOnChange));
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
  });
  
  it('shows toast when showToasts is true', () => {
    (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue({
      filters: {
        format: 'Leilão'
      },
      lastUpdatedFilter: 'format'
    });
    
    renderHook(() => useFilterConsistency({ 
      onChange: mockOnChange,
      showToasts: true 
    }));
    
    expect(mockToast).toHaveBeenCalledTimes(1);
  });
  
  it('does not trigger events when autoTriggerEvents is false', () => {
    (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue({
      filters: {
        format: 'Leilão'
      },
      lastUpdatedFilter: 'format'
    });
    
    renderHook(() => useFilterConsistency({ 
      onChange: mockOnChange,
      autoTriggerEvents: false 
    }));
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockDispatchEvent).not.toHaveBeenCalled();
  });
  
  it('shows special toast for reset action', () => {
    (filterStoreModule.useFilterStore as unknown as jest.Mock).mockReturnValue({
      filters: {},
      lastUpdatedFilter: 'reset'
    });
    
    renderHook(() => useFilterConsistency({ 
      showToasts: true 
    }));
    
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Filtros resetados"
    }));
  });
});
