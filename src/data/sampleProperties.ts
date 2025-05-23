import { PropertyItem } from '@/types/property';

export const sampleProperties: PropertyItem[] = [
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
      type: "Apartamento",
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
    description: "Casa em condomínio de alto padrão com 4 suítes e piscina",
    currentBid: 1250000,
    minBid: 1200000,
    originalPrice: 1800000,
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 6, 20, 15, 0),
    address: "Condomínio Jardins, Rua das Flores, 50",
    location: "Goiânia, GO",
    propertyInfo: {
      type: "Casa",
      usefulAreaM2: 320,
      bedrooms: 4,
      bathrooms: 5,
      garages: 4
    },
    bidCount: 5,
    format: "Leilão",
    origin: "Extrajudicial",
    place: "2ª Praça",
    createdAt: new Date(2025, 5, 5)
  },
  {
    id: "prop-003",
    title: "Loja em Shopping Center",
    description: "Loja comercial pronta para uso em shopping de alto fluxo",
    currentBid: 380000,
    minBid: 350000,
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 6, 25, 16, 30),
    address: "Shopping Center Norte, Loja 42",
    location: "São Paulo, SP",
    propertyInfo: {
      type: "Loja",
      usefulAreaM2: 45
    },
    bidCount: 3,
    format: "Venda Direta",
    origin: "Particular",
    place: "Praça única",
    createdAt: new Date(2025, 5, 10)
  },
  {
    id: "prop-004",
    title: "Terreno em Área Nobre",
    description: "Terreno plano em localização privilegiada com vista para o mar",
    currentBid: 950000,
    minBid: 900000,
    originalPrice: 1200000,
    imageUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 7, 5, 10, 0),
    address: "Alameda das Palmeiras, s/n",
    location: "Florianópolis, SC",
    propertyInfo: {
      type: "Terreno",
      usefulAreaM2: 500
    },
    bidCount: 12,
    format: "Leilão",
    origin: "Judicial",
    place: "1ª Praça",
    createdAt: new Date(2025, 5, 15)
  },
  {
    id: "prop-005",
    title: "Sala Comercial Centro",
    description: "Sala comercial com recepção, 3 ambientes e garagem",
    currentBid: 280000,
    minBid: 260000,
    originalPrice: 350000,
    imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 7, 10, 14, 0),
    address: "Edifício Central Business, 15º andar, Sala 1502",
    location: "Rio de Janeiro, RJ",
    propertyInfo: {
      type: "Sala",
      usefulAreaM2: 65,
      garages: 1
    },
    bidCount: 6,
    format: "Leilão",
    origin: "Extrajudicial",
    place: "2ª Praça",
    createdAt: new Date(2025, 5, 20)
  },
  {
    id: "prop-006",
    title: "Apartamento Duplex",
    description: "Apartamento duplex com 3 quartos e terraço",
    currentBid: 850000,
    minBid: 820000,
    originalPrice: 1100000,
    imageUrl: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 7, 15, 16, 0),
    address: "Rua das Acácias, 250, Apt 1201",
    location: "Belo Horizonte, MG",
    propertyInfo: {
      type: "Apartamento",
      usefulAreaM2: 145,
      bedrooms: 3,
      bathrooms: 3,
      garages: 2
    },
    bidCount: 9,
    format: "Leilão",
    origin: "Judicial",
    place: "3ª Praça",
    createdAt: new Date(2025, 5, 25)
  }
];
