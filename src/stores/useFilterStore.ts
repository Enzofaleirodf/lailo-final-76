import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  ContentType, FilterState, LocationFilter, ExpandedSectionsState,
  FilterFormat, FilterOrigin, FilterPlace, FilterStoreState, PriceRangeFilter
} from '@/types/filters';
import { DEFAULT_FILTER_VALUES, DEFAULT_EXPANDED_SECTIONS, DEFAULT_RANGE_VALUES } from '@/constants/filterConstants';

// Export the default range values with the correct name
export const defaultRangeValues = DEFAULT_RANGE_VALUES;

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
  getActiveFiltersCount: () => number;
  getSelectedOrigins: () => FilterOrigin[];
  getSelectedPlaces: () => FilterPlace[];
  updateMultipleOrigins: (origins: FilterOrigin[]) => void;
  updateMultiplePlaces: (places: FilterPlace[]) => void;
  selectedOrigins: FilterOrigin[];
  selectedPlaces: FilterPlace[];
}

// Count active filters to show in badge
// Improved to only count filters that differ from default values or initial state
const countActiveFilters = (filters: FilterState): number => {
  let count = 0;
  
  // Location filters (state or city)
  if (filters.location?.state || filters.location?.city) count++;
  
  // Vehicle types - ensure it's an array before checking length
  const vehicleTypes = filters.vehicleTypes || [];
  if (vehicleTypes.length > 0) count++;
  
  // Property types - ensure it's an array before checking length
  const propertyTypes = filters.propertyTypes || [];
  if (propertyTypes.length > 0) count++;
  
  // Price range - só contar se os valores forem significativamente diferentes dos padrões
  // Verificar se o valor mínimo e máximo são próximos dos padrões (com uma margem de tolerância)
  const isPriceDefault = 
    (!filters.price?.range?.min || filters.price.range.min === DEFAULT_RANGE_VALUES.price.min) && 
    (!filters.price?.range?.max || filters.price.range.max === DEFAULT_RANGE_VALUES.price.max);
  
  if (!isPriceDefault) count++;
  
  // Year range - só contar se os valores forem significativamente diferentes dos padrões
  const isYearDefault = 
    (!filters.year?.min || filters.year.min === DEFAULT_RANGE_VALUES.year.min) && 
    (!filters.year?.max || filters.year.max === DEFAULT_RANGE_VALUES.year.max);
  
  if (!isYearDefault) count++;
  
  // Useful area range - só contar se os valores forem significativamente diferentes dos padrões
  const isAreaDefault = 
    (!filters.usefulArea?.min || filters.usefulArea.min === DEFAULT_RANGE_VALUES.usefulArea.min) && 
    (!filters.usefulArea?.max || filters.usefulArea.max === DEFAULT_RANGE_VALUES.usefulArea.max);
  
  if (!isAreaDefault) count++;
  
  // Brand, model, color
  if (filters.brand !== 'todas') count++;
  if (filters.model !== 'todos') count++;
  if (filters.color !== 'todas') count++;
  
  // Auction format, origin, place - Only count if different from visual defaults
  if (filters.format !== 'Leilão') count++; // Using 'Leilão' as the default
  if (filters.origin !== 'Extrajudicial') count++;
  if (filters.place !== 'Praça única') count++;

  // Category - conta se for diferente do padrão
  if (filters.category !== 'Todos') count++;
  
  return count;
};

// Create the store with Zustand
export const useFilterStore = create<FilterStore>()(
  devtools(
    (set, get) => ({
      filters: {
        ...DEFAULT_FILTER_VALUES,
        vehicleTypes: [], // Ensure vehicleTypes is initialized as an empty array
        propertyTypes: [], // Ensure propertyTypes is initialized as an empty array
      },
      expandedSections: DEFAULT_EXPANDED_SECTIONS,
      activeFilters: 0,
      lastUpdatedFilter: 'initial',
      selectedOrigins: ['Extrajudicial'],
      selectedPlaces: ['Praça única'],
      
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
          
          // Se o tipo de conteúdo mudar, redefinir a categoria para "Todos"
          if (key === 'contentType') {
            newFilters.category = 'Todos';
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
            ...DEFAULT_FILTER_VALUES,
            // Preserve content type when resetting
            contentType: state.filters.contentType,
            vehicleTypes: [], // Ensure arrays are initialized
            propertyTypes: [],
          }, 
          activeFilters: 0,
          lastUpdatedFilter: 'reset',
          selectedOrigins: ['Extrajudicial'],
          selectedPlaces: ['Praça única']
        }));
      },
      
      // Set multiple filters at once (used for URL sync)
      setFilters: (newFilters) => {
        set((state) => {
          const updatedFilters = { 
            ...state.filters, 
            ...newFilters,
            vehicleTypes: newFilters.vehicleTypes || [], // Ensure arrays are initialized
            propertyTypes: newFilters.propertyTypes || [],
          };
          
          // Update selected origins and places
          const selectedOrigins = newFilters.origin ? [newFilters.origin as FilterOrigin] : state.selectedOrigins;
          const selectedPlaces = newFilters.place ? [newFilters.place as FilterPlace] : state.selectedPlaces;
          
          return { 
            filters: updatedFilters, 
            activeFilters: countActiveFilters(updatedFilters),
            lastUpdatedFilter: 'bulk',
            selectedOrigins,
            selectedPlaces
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
        const sections = { ...DEFAULT_EXPANDED_SECTIONS };
        Object.keys(sections).forEach((key) => {
          sections[key as keyof ExpandedSectionsState] = false;
        });
        set({ expandedSections: sections });
      },
      
      // Expand all filter sections
      expandAllSections: () => {
        const sections = { ...DEFAULT_EXPANDED_SECTIONS };
        Object.keys(sections).forEach((key) => {
          sections[key as keyof ExpandedSectionsState] = true;
        });
        set({ expandedSections: sections });
      },
      
      // Get the count of active filters
      getActiveFiltersCount: () => {
        const { filters } = get();
        return countActiveFilters(filters);
      },
      
      // Get selected origins (for multi-select)
      getSelectedOrigins: () => {
        return get().selectedOrigins;
      },
      
      // Get selected places (for multi-select)
      getSelectedPlaces: () => {
        return get().selectedPlaces;
      },
      
      // Update multiple origins
      updateMultipleOrigins: (origins) => {
        if (origins.length === 0) return;
        
        set((state) => {
          // Store all selected origins
          const selectedOrigins = [...origins];
          
          const newFilters = { 
            ...state.filters, 
            origin: origins[0] // Keep the first one as the main filter for backward compatibility
          };
          
          return { 
            filters: newFilters, 
            activeFilters: countActiveFilters(newFilters),
            lastUpdatedFilter: 'origin',
            selectedOrigins
          };
        });
      },
      
      // Update multiple places
      updateMultiplePlaces: (places) => {
        if (places.length === 0) return;
        
        set((state) => {
          // Store all selected places
          const selectedPlaces = [...places];
          
          const newFilters = { 
            ...state.filters, 
            place: places[0] // Keep the first one as the main filter for backward compatibility
          };
          
          return { 
            filters: newFilters, 
            activeFilters: countActiveFilters(newFilters),
            lastUpdatedFilter: 'place',
            selectedPlaces
          };
        });
      }
    }),
    { name: 'filter-store' }
  )
);
