
export type ContentType = 'property' | 'vehicle';
export type VehicleType = 'car' | 'motorcycle' | 'truck' | 'other';
export type FilterFormat = 'Todos' | 'Alienação Particular' | 'Leilão' | 'Venda Direta';
export type FilterOrigin = 'Todas' | 'Extrajudicial' | 'Judicial' | 'Particular' | 'Público';
export type FilterPlace = 'Todas' | 'Praça única' | '1ª Praça' | '2ª Praça' | '3ª Praça';
// Make sure there's alignment between types for the auction place and filter place values
export type AuctionPlace = FilterPlace;

export interface YearRange {
  min: string;
  max: string;
}

export interface PriceRange {
  min: string;
  max: string;
}
