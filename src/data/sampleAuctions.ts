import { AuctionItem } from '@/types/auction';

// Helper function to generate random dates in the near future
const getRandomFutureDate = () => {
  const now = new Date();
  const daysToAdd = Math.floor(Math.random() * 14) + 1; // 1-14 days
  now.setDate(now.getDate() + daysToAdd);
  return now;
};

export const sampleAuctions: AuctionItem[] = [
  {
    id: '1',
    title: 'Honda Civic EX 2020',
    description: 'Sedan em ótimo estado, único dono, baixa quilometragem.',
    currentBid: 82000,
    minBid: 80000,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'São Paulo, SP',
    vehicleInfo: {
      brand: 'Honda',
      model: 'Civic EX',
      year: 2020,
      color: 'Prata',
      type: 'car',
      mileage: 35000
    },
    bidCount: 12,
    format: 'Leilão',
    origin: 'Extrajudicial',
    place: '1ª Praça'
  },
  {
    id: '2',
    title: 'Toyota Corolla XEI 2019',
    description: 'Sedan completo, revisado, com garantia remanescente.',
    currentBid: 75000,
    minBid: 72000,
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Rio de Janeiro, RJ',
    vehicleInfo: {
      brand: 'Toyota',
      model: 'Corolla XEI',
      year: 2019,
      color: 'Branco',
      type: 'car',
      mileage: 45000
    },
    bidCount: 8,
    format: 'Leilão',
    origin: 'Judicial',
    place: '2ª Praça'
  },
  {
    id: '3',
    title: 'Yamaha MT-07 2021',
    description: 'Moto esportiva em excelente estado, poucos quilômetros rodados.',
    currentBid: 42000,
    minBid: 40000,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Belo Horizonte, MG',
    vehicleInfo: {
      brand: 'Yamaha',
      model: 'MT-07',
      year: 2021,
      color: 'Azul',
      type: 'motorcycle',
      mileage: 8000
    },
    bidCount: 15,
    format: 'Venda Direta',
    origin: 'Extrajudicial',
    place: '1ª Praça'
  },
  {
    id: '4',
    title: 'Volkswagen Golf GTI 2018',
    description: 'Hatch esportivo, todas as revisões em concessionária.',
    currentBid: 110000,
    minBid: 105000,
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2964&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Curitiba, PR',
    vehicleInfo: {
      brand: 'Volkswagen',
      model: 'Golf GTI',
      year: 2018,
      color: 'Vermelho',
      type: 'car',
      mileage: 52000
    },
    bidCount: 20,
    format: 'Leilão',
    origin: 'Judicial',
    place: '2ª Praça'
  },
  {
    id: '5',
    title: 'Ford Ranger XLT 2019',
    description: 'Picape 4x4, diesel, completa, excelente para trabalho e lazer.',
    currentBid: 135000,
    minBid: 130000,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Brasília, DF',
    vehicleInfo: {
      brand: 'Ford',
      model: 'Ranger XLT',
      year: 2019,
      color: 'Preto',
      type: 'truck',
      mileage: 65000
    },
    bidCount: 7,
    format: 'Leilão',
    origin: 'Extrajudicial',
    place: '1ª Praça'
  },
  {
    id: '6',
    title: 'Jeep Compass Limited 2020',
    description: 'SUV premium, teto solar panorâmico, pacote de tecnologia completo.',
    currentBid: 145000,
    minBid: 140000,
    imageUrl: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Porto Alegre, RS',
    vehicleInfo: {
      brand: 'Jeep',
      model: 'Compass Limited',
      year: 2020,
      color: 'Cinza',
      type: 'car',
      mileage: 40000
    },
    bidCount: 14,
    format: 'Venda Direta',
    origin: 'Judicial',
    place: '2ª Praça'
  }
];

export const fetchSampleAuctions = async () => {
  // In a real app, this would be an API call
  // For now, we'll just return the existing sample data
  return sampleAuctions;
};
