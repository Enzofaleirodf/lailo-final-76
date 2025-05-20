export type ContentType = 'property' | 'vehicle';

export interface LocationFilter {
  state: string;
  city: string;
}

export interface PriceRangeFilter {
  range: {
    min: string;
    max: string;
  };
}

export interface YearRangeFilter {
  min: string;
  max: string;
}

export interface UsefulAreaFilter {
  min: string;
  max: string;
}

export interface FilterState {
  contentType: ContentType;
  location: LocationFilter;
  vehicleTypes: string[];
  propertyTypes: string[];
  price: PriceRangeFilter;
  year: YearRangeFilter;
  usefulArea: UsefulAreaFilter;
  brand: string;
  model: string;
  color: string;
  format: 'Todos' | 'Alienação Particular' | 'Leilão' | 'Venda Direta';
  origin: 'Todas' | 'Extrajudicial' | 'Judicial' | 'Particular' | 'Público';
  place: 'Todas' | 'Praça única' | '1ª Praça' | '2ª Praça' | '3ª Praça';
}

export interface ExpandedSectionsState {
  location: boolean;
  vehicleType: boolean;
  propertyType: boolean;
  price: boolean;
  year: boolean;
  usefulArea: boolean;
  model: boolean;
  color: boolean;
}

// Add to your existing FilterStore interface or create it if it doesn't exist
export interface FilterStoreState {
  filters: FilterState;
  expandedSections: ExpandedSectionsState;
  activeFilters: number;
  lastUpdatedFilter: string | null;
}
