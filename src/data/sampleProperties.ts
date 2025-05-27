import { PropertyItem } from '@/types/property';

export const sampleProperties: PropertyItem[] = [
  // RESIDENCIAIS
  {
    id: "prop-001",
    title: "Apartamento em Asa Norte",
    description: "Amplo apartamento com 2 quartos, varanda e vista para o parque",
    currentBid: 450000,
    minBid: 420000,
    originalPrice: 580000,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 6, 15, 14, 30),
    address: "SQN 104, Bloco A",
    location: "Brasília, DF",
    propertyInfo: {
      type: "Apartamentos",
      usefulAreaM2: 72,
      bedrooms: 2,
      bathrooms: 1,
      garages: 1
    },
    bidCount: 8,
    format: "Leilão",
    origin: "Judicial",
    place: "1ª Praça",
    createdAt: new Date(2025, 5, 1)
  },
  {
    id: "prop-002",
    title: "Casa em Condomínio Fechado",
    description: "Casa com 3 quartos, piscina e área de lazer completa",
    currentBid: 780000,
    minBid: 750000,
    originalPrice: 950000,
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 7, 10, 15, 0),
    address: "Condomínio Solar de Brasília, Quadra 3",
    location: "Brasília, DF",
    propertyInfo: {
      type: "Casas",
      usefulAreaM2: 180,
      bedrooms: 3,
      bathrooms: 2,
      garages: 2
    },
    bidCount: 12,
    format: "Leilão",
    origin: "Extrajudicial",
    place: "2ª Praça",
    createdAt: new Date(2025, 5, 10)
  },
  {
    id: "prop-003",
    title: "Studio Moderno",
    description: "Studio compacto e moderno, ideal para solteiros ou casais",
    currentBid: 320000,
    minBid: 300000,
    originalPrice: 380000,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 6, 20, 16, 30),
    address: "Rua das Flores, 123, Apto 501",
    location: "São Paulo, SP",
    propertyInfo: {
      type: "Studios",
      usefulAreaM2: 45,
      bedrooms: 1,
      bathrooms: 1,
      garages: 1
    },
    bidCount: 5,
    format: "Venda Direta",
    origin: "Extrajudicial",
    place: 'Praça única',
    createdAt: new Date(2025, 5, 15)
  },
  {
    id: "prop-004",
    title: "Loft Duplex",
    description: "Loft com pé direito duplo e design contemporâneo",
    currentBid: 520000,
    minBid: 500000,
    originalPrice: 650000,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 7, 5, 14, 0),
    address: "Rua Augusta, 1500, Loft 302",
    location: "São Paulo, SP",
    propertyInfo: {
      type: "Lofts",
      usefulAreaM2: 85,
      bedrooms: 1,
      bathrooms: 2,
      garages: 1
    },
    bidCount: 10,
    format: "Leilão",
    origin: "Judicial",
    place: "1ª Praça",
    createdAt: new Date(2025, 5, 20)
  },
  {
    id: "prop-005",
    title: "Terreno em Condomínio",
    description: "Terreno plano em condomínio fechado com infraestrutura completa",
    currentBid: 280000,
    minBid: 250000,
    originalPrice: 350000,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 8, 1, 15, 30),
    address: "Condomínio Jardins, Lote 45",
    location: "Goiânia, GO",
    propertyInfo: {
      type: "Terrenos",
      usefulAreaM2: 450
    },
    bidCount: 6,
    format: "Leilão",
    origin: "Extrajudicial",
    place: "2ª Praça",
    createdAt: new Date(2025, 6, 1)
  },
  
  // COMERCIAIS
  {
    id: "prop-006",
    title: "Sala Comercial",
    description: "Sala comercial em prédio de alto padrão no centro empresarial",
    currentBid: 380000,
    minBid: 350000,
    originalPrice: 450000,
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 7, 25, 16, 0),
    address: "Av. Paulista, 1000, Sala 1205",
    location: "São Paulo, SP",
    propertyInfo: {
      type: "Salas",
      usefulAreaM2: 65
    },
    bidCount: 7,
    format: "Leilão",
    origin: "Judicial",
    place: "1ª Praça",
    createdAt: new Date(2025, 6, 10)
  },
  {
    id: "prop-007",
    title: "Loja em Shopping",
    description: "Loja em shopping center de grande circulação",
    currentBid: 620000,
    minBid: 600000,
    originalPrice: 750000,
    imageUrl: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 8, 10, 15, 0),
    address: "Shopping Center Norte, Loja 45",
    location: "São Paulo, SP",
    propertyInfo: {
      type: "Lojas",
      usefulAreaM2: 120
    },
    bidCount: 9,
    format: "Venda Direta",
    origin: "Extrajudicial",
    place: 'Praça única',
    createdAt: new Date(2025, 6, 15)
  },
  {
    id: "prop-008",
    title: "Conjunto Comercial",
    description: "Conjunto comercial com 5 salas e recepção",
    currentBid: 850000,
    minBid: 800000,
    originalPrice: 980000,
    imageUrl: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 7, 30, 14, 30),
    address: "Av. Brigadeiro Faria Lima, 3500, Conj. 1201",
    location: "São Paulo, SP",
    propertyInfo: {
      type: "Conjuntos",
      usefulAreaM2: 200
    },
    bidCount: 11,
    format: "Leilão",
    origin: "Judicial",
    place: "2ª Praça",
    createdAt: new Date(2025, 6, 20)
  },
  
  // INDUSTRIAIS
  {
    id: "prop-009",
    title: "Galpão Industrial",
    description: "Galpão industrial com pé direito alto e docas para carga e descarga",
    currentBid: 1200000,
    minBid: 1150000,
    originalPrice: 1500000,
    imageUrl: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 8, 15, 15, 0),
    address: "Distrito Industrial, Quadra 5, Lote 10",
    location: "Campinas, SP",
    propertyInfo: {
      type: "Galpões",
      usefulAreaM2: 1200
    },
    bidCount: 8,
    format: "Leilão",
    origin: "Extrajudicial",
    place: "1ª Praça",
    createdAt: new Date(2025, 7, 1)
  },
  {
    id: "prop-010",
    title: "Terreno Industrial",
    description: "Terreno industrial com infraestrutura completa",
    currentBid: 850000,
    minBid: 800000,
    originalPrice: 1000000,
    imageUrl: "https://images.unsplash.com/photo-1513880989635-6eb491ce7f5b?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 9, 1, 16, 0),
    address: "Polo Industrial, Quadra 10, Lote 5",
    location: "Goiânia, GO",
    propertyInfo: {
      type: "Terrenos",
      usefulAreaM2: 5000
    },
    bidCount: 6,
    format: "Venda Direta",
    origin: "Extrajudicial",
    place: "Praça única",
    createdAt: new Date(2025, 7, 10)
  },
  
  // RURAIS
  {
    id: "prop-011",
    title: "Fazenda Produtiva",
    description: "Fazenda com área de plantio, pastagem e infraestrutura completa",
    currentBid: 3500000,
    minBid: 3400000,
    originalPrice: 4200000,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 8, 20, 15, 0),
    address: "Rodovia BR-060, Km 120",
    location: "Goiás, GO",
    propertyInfo: {
      type: "Fazendas",
      usefulAreaM2: 1500000 // 150 hectares
    },
    bidCount: 15,
    format: "Leilão",
    origin: "Judicial",
    place: "1ª Praça",
    createdAt: new Date(2025, 7, 15)
  },
  {
    id: "prop-012",
    title: "Chácara com Lago",
    description: "Chácara com casa sede, lago para pesca e pomar",
    currentBid: 580000,
    minBid: 550000,
    originalPrice: 700000,
    imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 9, 5, 14, 30),
    address: "Estrada da Serra, Km 15",
    location: "Brasília, DF",
    propertyInfo: {
      type: "Chácaras",
      usefulAreaM2: 20000 // 2 hectares
    },
    bidCount: 10,
    format: "Leilão",
    origin: "Extrajudicial",
    place: "2ª Praça",
    createdAt: new Date(2025, 7, 20)
  },
  {
    id: "prop-013",
    title: "Sítio com Casa",
    description: "Sítio com casa sede, curral e área de lazer",
    currentBid: 420000,
    minBid: 400000,
    originalPrice: 500000,
    imageUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 8, 25, 15, 30),
    address: "Estrada do Sítio, Km 5",
    location: "Pirenópolis, GO",
    propertyInfo: {
      type: "Sítios",
      usefulAreaM2: 30000 // 3 hectares
    },
    bidCount: 7,
    format: "Venda Direta",
    origin: "Extrajudicial",
    place: 'Praça única',
    createdAt: new Date(2025, 8, 1)
  },
  
  // HOSPEDAGENS
  {
    id: "prop-014",
    title: "Hotel em Área Turística",
    description: "Hotel com 30 quartos, restaurante e piscina em área turística",
    currentBid: 2800000,
    minBid: 2700000,
    originalPrice: 3500000,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 9, 10, 16, 0),
    address: "Av. Beira Mar, 1000",
    location: "Florianópolis, SC",
    propertyInfo: {
      type: "Hotéis",
      usefulAreaM2: 2500
    },
    bidCount: 14,
    format: "Leilão",
    origin: "Judicial",
    place: "1ª Praça",
    createdAt: new Date(2025, 8, 10)
  },
  {
    id: "prop-015",
    title: "Pousada em Cidade Histórica",
    description: "Pousada com 15 quartos e café da manhã em cidade histórica",
    currentBid: 1200000,
    minBid: 1150000,
    originalPrice: 1500000,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 9, 15, 15, 0),
    address: "Rua das Pedras, 50",
    location: "Ouro Preto, MG",
    propertyInfo: {
      type: "Pousadas",
      usefulAreaM2: 800
    },
    bidCount: 9,
    format: "Leilão",
    origin: "Extrajudicial",
    place: "2ª Praça",
    createdAt: new Date(2025, 8, 15)
  }
];
