
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
