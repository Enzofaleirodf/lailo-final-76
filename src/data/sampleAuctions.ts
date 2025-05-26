import { AuctionItem } from '@/types/auction';

// Helper function to generate random dates in the near future
const getRandomFutureDate = () => {
  const now = new Date();
  const daysToAdd = Math.floor(Math.random() * 14) + 1; // 1-14 days
  now.setDate(now.getDate() + daysToAdd);
  return now;
};

// Helper to generate random prices
const getRandomPrice = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const sampleAuctions: AuctionItem[] = [
  // LEVES - CARROS
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
      type: 'Carros',
      mileage: 35000
    },
    bidCount: 12,
    format: 'Leilão',
    origin: 'Extrajudicial',
    place: '1ª Praça',
    createdAt: new Date()
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
      type: 'Carros',
      mileage: 45000
    },
    bidCount: 8,
    format: 'Leilão',
    origin: 'Judicial',
    place: '2ª Praça',
    createdAt: new Date()
  },
  
  // LEVES - MOTOS
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
      type: 'Motos',
      mileage: 8000
    },
    bidCount: 15,
    format: 'Venda Direta',
    origin: 'Extrajudicial',
    place: 'Praça Única',
    createdAt: new Date()
  },
  {
    id: '4',
    title: 'Honda CB 500X 2022',
    description: 'Moto trail em perfeito estado, ideal para viagens.',
    currentBid: 38000,
    minBid: 36000,
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Curitiba, PR',
    vehicleInfo: {
      brand: 'Honda',
      model: 'CB 500X',
      year: 2022,
      color: 'Vermelho',
      type: 'Motos',
      mileage: 12000
    },
    bidCount: 10,
    format: 'Leilão',
    origin: 'Judicial',
    place: '2ª Praça',
    createdAt: new Date()
  },
  
  // PESADOS - CAMINHÕES
  {
    id: '5',
    title: 'Ford Cargo 2428 2019',
    description: 'Caminhão truck em bom estado, revisado e pronto para trabalhar.',
    currentBid: 180000,
    minBid: 175000,
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Goiânia, GO',
    vehicleInfo: {
      brand: 'Ford',
      model: 'Cargo 2428',
      year: 2019,
      color: 'Branco',
      type: 'Caminhões',
      mileage: 120000
    },
    bidCount: 7,
    format: 'Leilão',
    origin: 'Extrajudicial',
    place: '1ª Praça',
    createdAt: new Date()
  },
  {
    id: '6',
    title: 'Volvo FH 540 2020',
    description: 'Cavalo mecânico com cabine leito, completo e revisado.',
    currentBid: 350000,
    minBid: 340000,
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Porto Alegre, RS',
    vehicleInfo: {
      brand: 'Volvo',
      model: 'FH 540',
      year: 2020,
      color: 'Azul',
      type: 'Cavalos Mecânicos',
      mileage: 200000
    },
    bidCount: 14,
    format: 'Venda Direta',
    origin: 'Judicial',
    place: 'Praça Única',
    createdAt: new Date()
  },
  
  // PESADOS - ÔNIBUS
  {
    id: '7',
    title: 'Mercedes-Benz O500 2018',
    description: 'Ônibus rodoviário com ar condicionado e banheiro.',
    currentBid: 280000,
    minBid: 270000,
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Salvador, BA',
    vehicleInfo: {
      brand: 'Mercedes-Benz',
      model: 'O500',
      year: 2018,
      color: 'Prata',
      type: 'Ônibus',
      mileage: 250000
    },
    bidCount: 9,
    format: 'Leilão',
    origin: 'Extrajudicial',
    place: '1ª Praça',
    createdAt: new Date()
  },
  
  // AÉREOS - AVIÕES
  {
    id: '8',
    title: 'Cessna 172 Skyhawk 2015',
    description: 'Avião monomotor em excelente estado, revisado e documentado.',
    currentBid: 650000,
    minBid: 630000,
    imageUrl: 'https://images.unsplash.com/photo-1583396618422-597b2755de83?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'São Paulo, SP',
    vehicleInfo: {
      brand: 'Cessna',
      model: '172 Skyhawk',
      year: 2015,
      color: 'Branco',
      type: 'Aviões',
      mileage: 1200
    },
    bidCount: 5,
    format: 'Leilão',
    origin: 'Judicial',
    place: '2ª Praça',
    createdAt: new Date()
  },
  
  // AÉREOS - HELICÓPTEROS
  {
    id: '9',
    title: 'Robinson R44 2017',
    description: 'Helicóptero com baixas horas de voo, revisado e documentado.',
    currentBid: 1200000,
    minBid: 1150000,
    imageUrl: 'https://images.unsplash.com/photo-1534786568720-8a8fce28f2c4?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Rio de Janeiro, RJ',
    vehicleInfo: {
      brand: 'Robinson',
      model: 'R44',
      year: 2017,
      color: 'Vermelho',
      type: 'Helicópteros',
      mileage: 800
    },
    bidCount: 3,
    format: 'Venda Direta',
    origin: 'Extrajudicial',
    place: 'Praça Única',
    createdAt: new Date()
  },
  
  // NÁUTICOS - LANCHAS
  {
    id: '10',
    title: 'Lancha Focker 280 2019',
    description: 'Lancha em excelente estado, motor Mercury 300HP.',
    currentBid: 320000,
    minBid: 300000,
    imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Florianópolis, SC',
    vehicleInfo: {
      brand: 'Focker',
      model: '280',
      year: 2019,
      color: 'Branco',
      type: 'Lanchas',
      mileage: 200
    },
    bidCount: 8,
    format: 'Leilão',
    origin: 'Judicial',
    place: '1ª Praça',
    createdAt: new Date()
  },
  
  // NÁUTICOS - JET SKIS
  {
    id: '11',
    title: 'Jet Ski Sea-Doo GTX 300 2021',
    description: 'Jet ski com pouquíssimo uso, revisado e documentado.',
    currentBid: 85000,
    minBid: 80000,
    imageUrl: 'https://images.unsplash.com/photo-1626438962460-c1df9a3c1f0e?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Balneário Camboriú, SC',
    vehicleInfo: {
      brand: 'Sea-Doo',
      model: 'GTX 300',
      year: 2021,
      color: 'Azul',
      type: 'Jet Skis',
      mileage: 50
    },
    bidCount: 12,
    format: 'Venda Direta',
    origin: 'Particular',
    place: 'Praça Única',
    createdAt: new Date()
  },
  
  // RECREATIVOS - QUADRICICLOS
  {
    id: '12',
    title: 'Quadriciclo Honda TRX 420 2020',
    description: 'Quadriciclo 4x4 em excelente estado, pouco uso.',
    currentBid: 45000,
    minBid: 42000,
    imageUrl: 'https://images.unsplash.com/photo-1621963249256-1dfe3e8a8d1c?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Goiânia, GO',
    vehicleInfo: {
      brand: 'Honda',
      model: 'TRX 420',
      year: 2020,
      color: 'Vermelho',
      type: 'Quadriciclos',
      mileage: 1500
    },
    bidCount: 6,
    format: 'Leilão',
    origin: 'Extrajudicial',
    place: '2ª Praça',
    createdAt: new Date()
  },
  
  // MÁQUINAS AGRÍCOLAS - TRATORES
  {
    id: '13',
    title: 'Trator John Deere 6110J 2019',
    description: 'Trator agrícola com cabine, ar condicionado e implementos.',
    currentBid: 280000,
    minBid: 270000,
    imageUrl: 'https://images.unsplash.com/photo-1592805144716-feeccccef5ac?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Rondonópolis, MT',
    vehicleInfo: {
      brand: 'John Deere',
      model: '6110J',
      year: 2019,
      color: 'Verde',
      type: 'Tratores',
      mileage: 3000
    },
    bidCount: 7,
    format: 'Leilão',
    origin: 'Judicial',
    place: '1ª Praça',
    createdAt: new Date()
  },
  
  // MÁQUINAS AGRÍCOLAS - COLHEITADEIRAS
  {
    id: '14',
    title: 'Colheitadeira Case IH 8250 2018',
    description: 'Colheitadeira com plataforma de 30 pés, em bom estado.',
    currentBid: 950000,
    minBid: 920000,
    imageUrl: 'https://images.unsplash.com/photo-1592805144716-feeccccef5ac?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Sorriso, MT',
    vehicleInfo: {
      brand: 'Case IH',
      model: '8250',
      year: 2018,
      color: 'Vermelho',
      type: 'Colheitadeiras',
      mileage: 4500
    },
    bidCount: 5,
    format: 'Venda Direta',
    origin: 'Extrajudicial',
    place: 'Praça Única',
    createdAt: new Date()
  },
  
  // MÁQUINAS DE CONSTRUÇÃO - ESCAVADEIRAS
  {
    id: '15',
    title: 'Escavadeira Caterpillar 320 2017',
    description: 'Escavadeira hidráulica com 5.000 horas de uso, revisada.',
    currentBid: 480000,
    minBid: 450000,
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Cuiabá, MT',
    vehicleInfo: {
      brand: 'Caterpillar',
      model: '320',
      year: 2017,
      color: 'Amarelo',
      type: 'Escavadeiras',
      mileage: 5000
    },
    bidCount: 6,
    format: 'Leilão',
    origin: 'Judicial',
    place: '2ª Praça',
    createdAt: new Date()
  },
  
  // AUXILIARES - REBOQUES
  {
    id: '16',
    title: 'Reboque para Barco 2020',
    description: 'Reboque para barco de até 21 pés, galvanizado.',
    currentBid: 12000,
    minBid: 10000,
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2970&auto=format&fit=crop',
    endDate: getRandomFutureDate(),
    location: 'Florianópolis, SC',
    vehicleInfo: {
      brand: 'Carretinha Brasil',
      model: 'Náutica 21',
      year: 2020,
      color: 'Prata',
      type: 'Reboques',
      mileage: 0
    },
    bidCount: 4,
    format: 'Venda Direta',
    origin: 'Particular',
    place: 'Praça Única',
    createdAt: new Date()
  }
];