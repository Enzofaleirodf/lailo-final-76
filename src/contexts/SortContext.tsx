
import React, { createContext, useContext, useState } from 'react';

type SortOption = 'relevance' | 'newest' | 'ending-soon' | 'price-asc' | 'price-desc';

interface SortContextType {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const SortContext = createContext<SortContextType | undefined>(undefined);

export const SortProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sortOption, setSortOption] = useState<SortOption>('relevance');

  return (
    <SortContext.Provider value={{ sortOption, setSortOption }}>
      {children}
    </SortContext.Provider>
  );
};

export const useSort = () => {
  const context = useContext(SortContext);
  if (context === undefined) {
    throw new Error('useSort must be used within a SortProvider');
  }
  return context;
};
