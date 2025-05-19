
export type ContentType = 'property' | 'vehicle';
export type VehicleType = 'car' | 'motorcycle' | 'truck' | 'other';
export type FilterFormat = 'Todos' | 'Alienação Particular' | 'Leilão' | 'Venda Direta';
export type FilterOrigin = 'Todas' | 'Extrajudicial' | 'Judicial' | 'Particular' | 'Público';
export type FilterPlace = 'Todas' | 'Praça única' | '1ª Praça' | '2ª Praça' | '3ª Praça';
// AuctionPlace now properly aligns with FilterPlace (except for 'Todas' which is only for filtering)
export type AuctionPlace = 'Praça única' | '1ª Praça' | '2ª Praça' | '3ª Praça';

export interface YearRange {
  min: string;
  max: string;
}

export interface PriceRange {
  min: string;
  max: string;
}
