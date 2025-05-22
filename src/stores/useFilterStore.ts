
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  ContentType, 
  FilterState, 
  LocationFilter, 
  ExpandedSectionsState,
  FilterFormat,
  FilterOrigin,
  FilterPlace,
  FilterStoreState,
  PriceRangeFilter
} from '@/types/filters';

// Define the shape of our store
interface FilterStore extends FilterStoreState {
  // Actions
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  resetFilters: () => void;
  setFilters: (filters: Partial<FilterState>) => void;
  toggleSection: (section: keyof ExpandedSectionsState) => void;
  collapseAllSections: () => void;
  expandAllSections: () => void;
}

// Define the initial state for filters with default values that match UI appearance
const initialFilterState: FilterState = {
  contentType: 'property',
  location: {
    state: '',
    city: ''
  },
  vehicleTypes: [],
  propertyTypes: [],
  price: {
    value: [0, 100],
    range: {
      min: '',
      max: ''
    }
  },
  year: {
    min: '',
    max: ''
  },
  usefulArea: {
    min: '',
    max: ''
  },
  brand: '',
  model: '',
  color: '',
  format: 'Todos',
  origin: 'Todas',
  place: 'Todas',
  category: ''
};

// Define which filter sections are expanded by default
const initialExpandedSections: ExpandedSectionsState = {
  location: true,
  vehicleType: true,
  propertyType: true,
  price: true,
  year: true,
  usefulArea: true,
  model: true,
  color: true,
  format: true,
  origin: true,
  place: true,
  category: true 
};

// Valores padrão para os filtros de intervalo (simulando o que viria do banco)
const defaultRangeValues = {
  price: {
    min: "10000",
    max: "1000000"
  },
  year: {
    min: "2000",
    max: new Date().getFullYear().toString()
  },
  usefulArea: {
    min: "30",
    max: "500"
  }
};

// Count active filters to show in badge
// Improved to only count filters that differ from default values or initial state
const countActiveFilters = (filters: FilterState): number => {
  let count = 0;
  
  // Location filters (state or city)
  if (filters.location.state || filters.location.city) count++;
  
  // Vehicle types
  if (filters.vehicleTypes.length > 0) count++;
  
  // Property types
  if (filters.propertyTypes.length > 0) count++;
  
  // Price range - só contar se os valores forem significativamente diferentes dos padrões e não estiverem vazios
  const isPriceDefault = 
    (!filters.price.range.min || filters.price.range.min === defaultRangeValues.price.min) && 
    (!filters.price.range.max || filters.price.range.max === defaultRangeValues.price.max);
  
  if (!isPriceDefault && (filters.price.range.min !== '' || filters.price.range.max !== '')) count++;
  
  // Year range - só contar se os valores forem significativamente diferentes dos padrões e não estiverem vazios
  const isYearDefault = 
    (!filters.year.min || filters.year.min === defaultRangeValues.year.min) && 
    (!filters.year.max || filters.year.max === defaultRangeValues.year.max);
  
  if (!isYearDefault && (filters.year.min !== '' || filters.year.max !== '')) count++;
  
  // Useful area range - só contar se os valores forem significativamente diferentes dos padrões e não estiverem vazios
  const isAreaDefault = 
    (!filters.usefulArea.min || filters.usefulArea.min === defaultRangeValues.usefulArea.min) && 
    (!filters.usefulArea.max || filters.usefulArea.max === defaultRangeValues.usefulArea.max);
  
  if (!isAreaDefault && (filters.usefulArea.min !== '' || filters.usefulArea.max !== '')) count++;
  
  // Brand, model, color - agora verificando se não estão vazios
  if (filters.brand !== '') count++;
  if (filters.model !== '') count++;
  if (filters.color !== '') count++;
  
  // Auction format, origin, place - verificar se não estão com valor padrão
  if (filters.format !== 'Todos') count++;
  if (filters.origin !== 'Todas') count++;
  if (filters.place !== 'Todas') count++;

  // Category - conta se for diferente do padrão (agora vazio)
  if (filters.category !== '') count++;
  
  return count;
};

// Create the store with Zustand
export const useFilterStore = create<FilterStore>()(
  devtools(
    (set, get) => ({
      filters: initialFilterState,
      expandedSections: initialExpandedSections,
      activeFilters: 0,
      lastUpdatedFilter: 'initial',
      
      // Update a specific filter value
      updateFilter: (key, value) => {
        set((state) => {
          const newFilters = { 
            ...state.filters, 
            [key]: value 
          };

          // Se a categoria mudar, precisamos resetar os tipos de veículos/imóveis
          if (key === 'category') {
            if (state.filters.contentType === 'vehicle') {
              newFilters.vehicleTypes = [];
            } else {
              newFilters.propertyTypes = [];
            }
          }
          
          // Se o tipo de conteúdo mudar, redefinir a categoria para vazio
          if (key === 'contentType') {
            newFilters.category = '';
            newFilters.vehicleTypes = [];
            newFilters.propertyTypes = [];
          }

          return { 
            filters: newFilters, 
            activeFilters: countActiveFilters(newFilters),
            lastUpdatedFilter: key
          };
        });
      },
      
      // Reset all filters to initial state
      resetFilters: () => {
        set((state) => ({ 
          filters: { 
            ...initialFilterState,
            // Preserve content type when resetting
            contentType: state.filters.contentType
          }, 
          activeFilters: 0,
          lastUpdatedFilter: 'reset'
        }));
      },
      
      // Set multiple filters at once (used for URL sync)
      setFilters: (newFilters) => {
        set((state) => {
          const updatedFilters = { ...state.filters, ...newFilters };
          return { 
            filters: updatedFilters, 
            activeFilters: countActiveFilters(updatedFilters),
            lastUpdatedFilter: 'bulk'
          };
        });
      },
      
      // Toggle expanded/collapsed state of filter sections
      toggleSection: (section) => {
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [section]: !state.expandedSections[section]
          }
        }));
      },
      
      // Collapse all filter sections
      collapseAllSections: () => {
        const sections = { ...initialExpandedSections };
        Object.keys(sections).forEach((key) => {
          sections[key as keyof ExpandedSectionsState] = false;
        });
        set({ expandedSections: sections });
      },
      
      // Expand all filter sections
      expandAllSections: () => {
        const sections = { ...initialExpandedSections };
        Object.keys(sections).forEach((key) => {
          sections[key as keyof ExpandedSectionsState] = true;
        });
        set({ expandedSections: sections });
      }
    }),
    { name: 'filter-store' }
  )
);

// Exportar os valores padrão para uso em outros componentes
export { defaultRangeValues };
