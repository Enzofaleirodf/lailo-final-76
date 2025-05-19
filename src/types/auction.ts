
export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  minBid: number;
  originalPrice?: number;
  imageUrl: string;
  endDate: Date;
  location: string;
  website?: string; // Added for future use
  href?: string;    // Added for future use
  vehicleInfo: {
    brand: string;
    model: string;
    year: number;
    color: string;
    type: string;
    mileage?: number;
  };
  bidCount: number;
  format: 'Leilão' | 'Venda Direta';
  origin: 'Judicial' | 'Extrajudicial';
  place: 'Praça única' | '1ª Praça' | '2ª Praça' | '3ª Praça';
  isNew?: boolean;  // Added for future use
  createdAt?: Date; // Added for future use
}
