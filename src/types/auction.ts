
export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  minBid: number;
  imageUrl: string;
  endDate: Date;
  location: string;
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
  place: 'Primeira' | 'Segunda';
}
