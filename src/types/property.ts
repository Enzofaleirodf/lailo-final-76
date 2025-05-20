
export interface PropertyItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  minBid: number;
  originalPrice?: number;
  imageUrl: string;
  endDate: Date;
  address: string;
  location: string;
  website?: string;
  href?: string;
  propertyInfo: {
    type: string;
    usefulAreaM2: number;
    bedrooms?: number;
    bathrooms?: number;
    garages?: number;
  };
  bidCount: number;
  format: 'Leilão' | 'Venda Direta';
  origin: 'Judicial' | 'Extrajudicial';
  place: 'Praça única' | '1ª Praça' | '2ª Praça' | '3ª Praça';
  isNew?: boolean;
  createdAt?: Date;
}
