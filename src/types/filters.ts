
export type ContentType = 'property' | 'vehicle';
export type VehicleType = 'car' | 'motorcycle' | 'truck' | 'other';
export type FilterFormat = 'Leilão' | 'Venda Direta' | 'Alienação Particular';
export type FilterOrigin = 'Todas' | 'Judicial' | 'Extrajudicial';
export type FilterPlace = 'Todas' | 'Primeira' | 'Segunda';

export interface YearRange {
  min: string;
  max: string;
}

export interface PriceRange {
  min: string;
  max: string;
}
