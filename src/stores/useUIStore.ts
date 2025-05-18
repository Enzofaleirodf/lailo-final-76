
import { create } from 'zustand';

interface UIStore {
  // State
  filtersOpen: boolean;
  sortOpen: boolean;
  
  // Actions
  setFiltersOpen: (open: boolean) => void;
  setSortOpen: (open: boolean) => void;
  toggleFilters: () => void;
  toggleSort: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // State
  filtersOpen: false,
  sortOpen: false,
  
  // Actions
  setFiltersOpen: (open) => set({ filtersOpen: open }),
  setSortOpen: (open) => set({ sortOpen: open }),
  toggleFilters: () => set((state) => ({ filtersOpen: !state.filtersOpen })),
  toggleSort: () => set((state) => ({ sortOpen: !state.sortOpen }))
}));
