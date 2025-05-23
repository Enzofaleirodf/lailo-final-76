
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
  },
  {
    id: "prop-007",
    title: "Casa de Luxo com Piscina",
    description: "Magnífica casa com 4 suítes, piscina, churrasqueira e jardim",
    currentBid: 1200000,
    minBid: 1150000,
    originalPrice: 1500000,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 8, 5, 15, 0),
    address: "Condomínio Alphaville, Lote 45",
    location: "Goiânia, GO",
    propertyInfo: {
      type: "Casa",
      usefulAreaM2: 320,
      bedrooms: 4,
      bathrooms: 5,
      garages: 3
    },
    bidCount: 15,
    format: "Leilão",
    origin: "Extrajudicial",
    place: "1ª Praça",
    createdAt: new Date(2025, 5, 30)
  },
  {
    id: "prop-008",
    title: "Cobertura Panorâmica",
    description: "Cobertura com vista 360° da cidade, terraço gourmet e jacuzzi",
    currentBid: 980000,
    minBid: 950000,
    originalPrice: 1200000,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 7, 28, 17, 30),
    address: "Edifício Sky Tower, Cobertura",
    location: "Fortaleza, CE",
    propertyInfo: {
      type: "Apartamento",
      usefulAreaM2: 180,
      bedrooms: 3,
      bathrooms: 4,
      garages: 2
    },
    bidCount: 12,
    format: "Venda Direta",
    origin: "Particular",
    place: "Praça única",
    createdAt: new Date(2025, 6, 5)
  },
  {
    id: "prop-009",
    title: "Galpão Industrial Moderno",
    description: "Galpão com pé direito alto, docas de carga e escritórios administrativos",
    currentBid: 750000,
    minBid: 720000,
    originalPrice: 950000,
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=500&q=80",
    endDate: new Date(2025, 8, 12, 14, 0),
    address: "Distrito Industrial, Quadra 15, Lote 8",
    location: "Curitiba, PR",
    propertyInfo: {
      type: "Galpão",
      usefulAreaM2: 850,
      garages: 4
    },
    bidCount: 7,
    format: "Leilão",
    origin: "Judicial",
    place: "2ª Praça",
    createdAt: new Date(2025, 6, 10)
  }
];
