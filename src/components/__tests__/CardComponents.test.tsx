
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyCard from '../PropertyCard';
import AuctionCard from '../AuctionCard';
import { PropertyItem } from '@/types/property';
import { AuctionItem } from '@/types/auction';

// Mock do hook useIsMobile
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: jest.fn().mockReturnValue(false)
}));

// Dados de teste
const testProperty: PropertyItem = {
  id: "prop123",
  title: "Apartamento em São Paulo",
  currentBid: 500000,
  originalPrice: 600000,
  imageUrl: "https://example.com/apartment.jpg",
  location: "São Paulo, SP",
  address: "Rua Exemplo, 123",
  origin: "Extrajudicial",
  place: "1ª Praça",
  endDate: new Date(2023, 11, 25, 15, 0), // 25/12/2023 15:00
  propertyInfo: {
    type: "Apartamento",
    usefulAreaM2: 75,
    bedrooms: 2,  // Corrigido de bedroomCount para bedrooms
    bathrooms: 1,
    garages: 1    // Corrigido de garageCount para garages
  },
  bidCount: 5,
  format: 'Leilão'
};

const testAuction: AuctionItem = {
  id: "auc456",
  title: "Honda Civic 2021",
  currentBid: 50000,
  originalPrice: 60000,
  imageUrl: "https://example.com/civic.jpg",
  location: "Rio de Janeiro, RJ",
  origin: "Judicial",
  place: "Praça única",
  endDate: new Date(2023, 11, 15, 14, 0), // 15/12/2023 14:00
  vehicleInfo: {
    type: "car",
    brand: "Honda",
    model: "Civic",
    year: 2021,  // Corrigido de string para number
    color: "Preto",
    mileage: 15000,
    fuel: "Flex"
  }
};

describe('Card Components Integration', () => {
  // Testes do PropertyCard
  describe('PropertyCard', () => {
    test('renderiza corretamente com todas as informações', () => {
      render(<PropertyCard property={testProperty} />);
      
      // Verificar título com tipo e área
      expect(screen.getByText(/Apartamento • 75m²/i)).toBeInTheDocument();
      
      // Verificar preços
      expect(screen.getByText('R$ 500.000,00')).toBeInTheDocument();
      expect(screen.getByText('R$ 600.000,00')).toBeInTheDocument();
      
      // Verificar endereço
      expect(screen.getByText(/Rua Exemplo, 123 - São Paulo, SP/i)).toBeInTheDocument();
      
      // Verificar badges
      expect(screen.getByText('Extrajudicial')).toBeInTheDocument();
      expect(screen.getByText('1ª Praça')).toBeInTheDocument();
      
      // Verificar data
      expect(screen.getByText(/25\/12\/23 às 15h/i)).toBeInTheDocument();
    });
    
    test('lida com dados incompletos corretamente', () => {
      const incompleteProperty: PropertyItem = {
        id: "prop999",
        title: "Propriedade Incompleta",
        currentBid: 100000,
        propertyInfo: {
          type: "Terreno",
          usefulAreaM2: 0
        }
      } as PropertyItem;
      
      render(<PropertyCard property={incompleteProperty} />);
      
      // Verificar que renderiza valores default para dados faltantes
      expect(screen.getByText(/Terreno • 0m²/i)).toBeInTheDocument();
      expect(screen.getByText('R$ 100.000,00')).toBeInTheDocument();
      expect(screen.getByText(/Endereço não disponível - Localização não disponível/i)).toBeInTheDocument();
      expect(screen.getByText('Origem não disponível')).toBeInTheDocument();
      expect(screen.getByText('Data não disponível')).toBeInTheDocument();
    });
    
    test('retorna null quando dados do imóvel são undefined', () => {
      // Silence error console during test
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const { container } = render(<PropertyCard property={undefined as any} />);
      
      expect(container.firstChild).toBeNull();
      expect(consoleErrorMock).toHaveBeenCalledWith('PropertyCard received undefined property data');
      
      consoleErrorMock.mockRestore();
    });
  });
  
  // Testes do AuctionCard
  describe('AuctionCard', () => {
    test('renderiza corretamente com todas as informações', () => {
      render(<AuctionCard auction={testAuction} />);
      
      // Verificar título (sem o ano)
      expect(screen.getByText('Honda Civic')).toBeInTheDocument();
      
      // Verificar preços
      expect(screen.getByText('R$ 50.000,00')).toBeInTheDocument();
      expect(screen.getByText('R$ 60.000,00')).toBeInTheDocument();
      
      // Verificar informações extras (cor e ano)
      expect(screen.getByText('Preto')).toBeInTheDocument();
      expect(screen.getByText('2021')).toBeInTheDocument();
      expect(screen.getByText('Rio de Janeiro, RJ')).toBeInTheDocument();
      
      // Verificar badges
      expect(screen.getByText('Judicial')).toBeInTheDocument();
      expect(screen.getByText('Praça única')).toBeInTheDocument();
      
      // Verificar data
      expect(screen.getByText(/15\/12\/23 às 14h/i)).toBeInTheDocument();
    });
    
    test('lida com dados incompletos corretamente', () => {
      const incompleteAuction: AuctionItem = {
        id: "auc999",
        title: "Veículo Incompleto",
        currentBid: 10000
      } as AuctionItem;
      
      render(<AuctionCard auction={incompleteAuction} />);
      
      // Verificar que renderiza valores default para dados faltantes
      expect(screen.getByText('Veículo Incompleto')).toBeInTheDocument();
      expect(screen.getByText('R$ 10.000,00')).toBeInTheDocument();
      expect(screen.getByText('Informações não disponíveis')).toBeInTheDocument();
      expect(screen.getByText('Origem não disponível')).toBeInTheDocument();
      expect(screen.getByText('Data não disponível')).toBeInTheDocument();
    });
    
    test('retorna null quando dados do leilão são undefined', () => {
      // Silence error console during test
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const { container } = render(<AuctionCard auction={undefined as any} />);
      
      expect(container.firstChild).toBeNull();
      expect(consoleErrorMock).toHaveBeenCalledWith('AuctionCard received undefined auction data');
      
      consoleErrorMock.mockRestore();
    });
  });
});
