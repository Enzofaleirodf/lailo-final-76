
import { calculateTotalSites, calculateNewAuctions } from '../AuctionStatus';
import { AuctionItem } from '@/types/auction';
import '@testing-library/jest-dom';

describe('AuctionStatus helper functions', () => {
  const mockAuctions: AuctionItem[] = [
    {
      id: '1',
      title: 'Test Auction 1',
      description: 'Description',
      currentBid: 10000,
      minBid: 9500,
      imageUrl: 'url1',
      endDate: new Date(),
      location: 'São Paulo',
      website: 'site1.com',
      vehicleInfo: {
        brand: 'Toyota',
        model: 'Corolla',
        year: new Date().getFullYear(), // current year (new)
        color: 'Black',
        type: 'car'
      },
      bidCount: 5,
      format: 'Leilão',
      origin: 'Judicial',
      place: '1ª Praça'
    },
    {
      id: '2',
      title: 'Test Auction 2',
      description: 'Description',
      currentBid: 15000,
      minBid: 14000,
      imageUrl: 'url2',
      endDate: new Date(),
      location: 'Rio de Janeiro',
      website: 'site2.com',
      vehicleInfo: {
        brand: 'Honda',
        model: 'Civic',
        year: new Date().getFullYear() - 1, // last year (not new)
        color: 'White',
        type: 'car'
      },
      bidCount: 3,
      format: 'Leilão',
      origin: 'Extrajudicial',
      place: '2ª Praça'
    },
    {
      id: '3',
      title: 'Test Auction 3',
      description: 'Description',
      currentBid: 8000,
      minBid: 7500,
      imageUrl: 'url3',
      endDate: new Date(),
      location: 'São Paulo',
      href: 'https://site3.com/auction',
      vehicleInfo: {
        brand: 'Volkswagen',
        model: 'Golf',
        year: new Date().getFullYear(), // current year (new)
        color: 'Red',
        type: 'car'
      },
      bidCount: 7,
      format: 'Venda Direta',
      origin: 'Judicial',
      place: '1ª Praça'
    }
  ];

  test('calculateTotalSites returns correct number of unique sites', () => {
    const result = calculateTotalSites(mockAuctions);
    expect(result).toBe(2); // São Paulo and Rio de Janeiro
  });

  test('calculateNewAuctions returns correct number of new auctions', () => {
    const result = calculateNewAuctions(mockAuctions);
    expect(result).toBe(2); // 2 auctions from current year
  });
});
