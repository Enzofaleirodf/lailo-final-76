
export type ContentType = 'property' | 'vehicle';

export type FilterFormat = 'Leilão' | 'Venda Direta';
export type FilterOrigin = 'Extrajudicial' | 'Judicial' | 'Particular' | 'Público';
export type FilterPlace = 'Praça única' | '1ª Praça' | '2ª Praça' | '3ª Praça';

export interface LocationFilter {
  state: string;
  city: string;
}

export interface PriceRangeFilter {
  value: number[];
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
  format: FilterFormat;
  origin: FilterOrigin;
  place: FilterPlace;
  category: string;
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
  format: boolean;
  origin: boolean;
  place: boolean;
  category: boolean;
}

// Interface para o estado do filtro store
export interface FilterStoreState {
  filters: FilterState;
  expandedSections: ExpandedSectionsState;
  activeFilters: number;
  lastUpdatedFilter: string | null;
}
