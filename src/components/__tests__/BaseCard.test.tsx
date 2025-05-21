
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseCard, { calculateDiscount, formatAuctionDate, formatEndTime } from '../BaseCard';

// Mock do hook useIsMobile
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: jest.fn().mockReturnValue(false)
}));

describe('BaseCard', () => {
  // Testar rendereização básica
  test('renderiza corretamente com props mínimas', () => {
    render(
      <BaseCard
        id="123"
        title="Item de Teste"
        price={{ current: 1000 }}
        extraInfo={<span>Informações extras</span>}
      />
    );
    
    expect(screen.getByText('Item de Teste')).toBeInTheDocument();
    expect(screen.getByText('Informações extras')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.000,00')).toBeInTheDocument();
  });
  
  // Testar cálculo de desconto
  test('calcula desconto corretamente', () => {
    expect(calculateDiscount(100, 80)).toBe(20); // 20% de desconto
    expect(calculateDiscount(100, 100)).toBeNull(); // Sem desconto
    expect(calculateDiscount(100, 110)).toBeNull(); // Preço atual maior que original
    expect(calculateDiscount(undefined, 100)).toBeNull(); // Sem preço original
  });
  
  // Testar formatação de data
  test('formata data corretamente', () => {
    const testDate = new Date(2023, 5, 15); // 15/06/2023
    expect(formatAuctionDate(testDate)).toBe('15/06/23');
    expect(formatAuctionDate(undefined)).toBe('Data não disponível');
  });
  
  // Testar formatação de horário
  test('formata horário corretamente', () => {
    const testDate = new Date(2023, 5, 15, 14, 30); // 14:30
    expect(formatEndTime(testDate)).toBe('14h');
    expect(formatEndTime(undefined)).toBe('');
  });
  
  // Testar funcionalidade de favorito
  test('toggle de favorito funciona corretamente', () => {
    const handleToggleFavorite = jest.fn();
    
    render(
      <BaseCard
        id="123"
        title="Item de Teste"
        price={{ current: 1000 }}
        extraInfo={<span>Informações extras</span>}
        onToggleFavorite={handleToggleFavorite}
      />
    );
    
    // Encontrar botão de favorito e clicar
    const favoriteButton = screen.getByRole('button', { name: /favoritos/i });
    fireEvent.click(favoriteButton);
    
    // Verificar se a função de callback foi chamada
    expect(handleToggleFavorite).toHaveBeenCalledWith('123', true);
  });
  
  // Testar exibição de desconto
  test('exibe badge de desconto quando há valor original maior', () => {
    render(
      <BaseCard
        id="123"
        title="Item de Teste"
        price={{ 
          current: 800,
          original: 1000 
        }}
        extraInfo={<span>Informações extras</span>}
      />
    );
    
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.000,00')).toHaveClass('line-through');
  });
  
  // Testar comportamento com imagem
  test('renderiza imagem quando imageUrl é fornecida', () => {
    render(
      <BaseCard
        id="123"
        title="Item de Teste"
        price={{ current: 1000 }}
        extraInfo={<span>Informações extras</span>}
        imageUrl="https://example.com/image.jpg"
      />
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Item de Teste');
  });
});
