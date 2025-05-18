
import { create } from 'zustand';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'highest-discount' | 'nearest';

interface SortStore {
  // State
  sortOption: SortOption;
  
  // Actions
  setSortOption: (option: SortOption) => void;
}

export const useSortStore = create<SortStore>((set) => ({
  // State
  sortOption: 'newest',
  
  // Actions
  setSortOption: (option) => set({ sortOption })
}));
