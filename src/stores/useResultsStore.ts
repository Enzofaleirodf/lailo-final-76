
import { create } from 'zustand';

interface ResultsState {
  // Data
  filteredItemsCount: number;
  totalSites: number;
  newItems: number;
  loading: boolean;
  
  // Actions
  setFilteredResults: (count: number, sites: number, newItems: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

// Default state
const DEFAULT_STATE = {
  filteredItemsCount: 0,
  totalSites: 0,
  newItems: 0,
  loading: true
};

export const useResultsStore = create<ResultsState>((set) => ({
  // Initial state
  ...DEFAULT_STATE,
  
  // Actions
  setFilteredResults: (count, sites, newItems) => set({
    filteredItemsCount: count,
    totalSites: sites,
    newItems: newItems,
    loading: false
  }),
  
  setLoading: (loading) => set({
    loading
  }),
  
  reset: () => set(DEFAULT_STATE)
}));
