
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  FilterState, 
  LocationFilter, 
  ExpandedSectionsState,
  FilterFormat,
  FilterOrigin,
  FilterPlace,
  FilterStoreState,
  PriceRangeFilter
} from '@/types/filters';

// Define a interface para a store de filtros de veículos
interface VehicleFilterStore extends FilterStoreState {
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

// Estado inicial para filtros de veículos
const initialVehicleFilterState: FilterState = {
  contentType: 'vehicle',
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
  format: '', 
  origin: '', 
  place: '',
  category: ''
};

// Seções expandidas por padrão
const initialExpandedSections: ExpandedSectionsState = {
  location: true,
  vehicleType: true,
  propertyType: false,
  price: true,
  year: true,
  usefulArea: false,
  model: true,
  color: true,
  format: true,
  origin: true,
  place: true,
  category: true 
};

// Valores padrão para os filtros de intervalo
export const defaultRangeValues = {
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

// Função para contar filtros ativos
const countActiveFilters = (filters: FilterState): number => {
  let count = 0;
  
  // Location filters
  if (filters.location.state || filters.location.city) count++;
  
  // Vehicle types
  if (filters.vehicleTypes.length > 0) count++;
  
  // Price range
  const isPriceDefault = 
    (!filters.price.range.min || filters.price.range.min === defaultRangeValues.price.min) && 
    (!filters.price.range.max || filters.price.range.max === defaultRangeValues.price.max);
  
  if (!isPriceDefault && (filters.price.range.min !== '' || filters.price.range.max !== '')) count++;
  
  // Year range
  const isYearDefault = 
    (!filters.year.min || filters.year.min === defaultRangeValues.year.min) && 
    (!filters.year.max || filters.year.max === defaultRangeValues.year.max);
  
  if (!isYearDefault && (filters.year.min !== '' || filters.year.max !== '')) count++;
  
  // Vehicle specific
  if (filters.brand !== '') count++;
  if (filters.model !== '') count++;
  if (filters.color !== '') count++;
  
  // Auction format, origin, place
  if (filters.format !== '') count++;
  if (filters.origin !== '') count++;
  if (filters.place !== '') count++;
  
  // Category
  if (filters.category !== '') count++;
  
  return count;
};

// Criar a store com Zustand
export const useVehicleFiltersStore = create<VehicleFilterStore>()(
  devtools(
    (set, get) => ({
      filters: initialVehicleFilterState,
      expandedSections: initialExpandedSections,
      activeFilters: 0,
      lastUpdatedFilter: 'initial',
      
      // Atualizar um valor específico de filtro
      updateFilter: (key, value) => {
        set((state) => {
          const newFilters = { 
            ...state.filters, 
            [key]: value 
          };

          // Se a categoria mudar, resetar os tipos de veículos
          if (key === 'category') {
            newFilters.vehicleTypes = [];
          }

          // Se o formato mudar para Alienação Particular ou Venda Direta, 
          // resetar etapa para vazio pois o filtro é inválido nestes casos
          if (key === 'format') {
            if (value === 'Alienação Particular' || value === 'Venda Direta') {
              newFilters.place = '';
            }
          }

          return { 
            filters: newFilters, 
            activeFilters: countActiveFilters(newFilters),
            lastUpdatedFilter: key
          };
        });
      },
      
      // Resetar todos os filtros para o estado inicial
      resetFilters: () => {
        set(() => ({ 
          filters: initialVehicleFilterState, 
          activeFilters: 0,
          lastUpdatedFilter: 'reset'
        }));
      },
      
      // Definir múltiplos filtros de uma vez (usado para sincronização de URL)
      setFilters: (newFilters) => {
        set((state) => {
          const updatedFilters = { ...state.filters, ...newFilters };
          
          // Garantir consistência: se o formato for Alienação Particular ou Venda Direta,
          // etapa deve ser vazia pois o filtro é inválido nestes casos
          if (updatedFilters.format === 'Alienação Particular' || updatedFilters.format === 'Venda Direta') {
            updatedFilters.place = '';
          }
          
          return { 
            filters: updatedFilters, 
            activeFilters: countActiveFilters(updatedFilters),
            lastUpdatedFilter: 'bulk'
          };
        });
      },
      
      // Alternar estado expandido/recolhido das seções de filtro
      toggleSection: (section) => {
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [section]: !state.expandedSections[section]
          }
        }));
      },
      
      // Recolher todas as seções de filtro
      collapseAllSections: () => {
        const sections = { ...initialExpandedSections };
        Object.keys(sections).forEach((key) => {
          sections[key as keyof ExpandedSectionsState] = false;
        });
        set({ expandedSections: sections });
      },
      
      // Expandir todas as seções de filtro
      expandAllSections: () => {
        const sections = { ...initialExpandedSections };
        Object.keys(sections).forEach((key) => {
          sections[key as keyof ExpandedSectionsState] = true;
        });
        set({ expandedSections: sections });
      }
    }),
    { name: 'vehicle-filter-store' }
  )
);
