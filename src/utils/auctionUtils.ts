
import { AuctionItem } from '@/types/auction';
import { SortOption } from '@/stores/useSortStore';
import { useMemo } from 'react';
import { FilterState, DEFAULT_FILTERS } from '@/stores/useFilterStore';

export const sortAuctions = (auctions: AuctionItem[], sortOption: SortOption): AuctionItem[] => {
  const sortedAuctions = [...auctions];
  
  switch (sortOption) {
    case 'newest':
      return sortedAuctions.sort((a, b) => b.vehicleInfo.year - a.vehicleInfo.year);
    
    case 'price-asc':
      return sortedAuctions.sort((a, b) => a.currentBid - b.currentBid);
    
    case 'price-desc':
      return sortedAuctions.sort((a, b) => b.currentBid - a.currentBid);
    
    case 'highest-discount':
      // Sort by discount percentage, safely handling cases where originalPrice might not exist
      return sortedAuctions.sort((a, b) => {
        const discountA = a.originalPrice && a.originalPrice > a.currentBid 
          ? (a.originalPrice - a.currentBid) / a.originalPrice
          : 0;
        const discountB = b.originalPrice && b.originalPrice > b.currentBid 
          ? (b.originalPrice - b.currentBid) / b.originalPrice
          : 0;
        return discountB - discountA;
      });
    
    case 'nearest':
      // For demonstration purposes, sorting by location name alphabetically
      // In a real app, you would calculate actual distances using coordinates
      return sortedAuctions.sort((a, b) => a.location.localeCompare(b.location));
      
    default:
      // Default to newest
      return sortedAuctions.sort((a, b) => b.vehicleInfo.year - a.vehicleInfo.year);
  }
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const useFilteredAndSortedAuctions = (
  auctions: AuctionItem[], 
  filters: FilterState, 
  sortOption: SortOption
): AuctionItem[] => {
  return useMemo(() => {
    const filteredAuctions = filterAuctions(auctions, filters);
    return sortAuctions(filteredAuctions, sortOption);
  }, [auctions, filters, sortOption]);
};

// Função auxiliar para normalizar strings para comparação
const normalizeString = (str: string): string => {
  return str.toLowerCase().trim();
};

// Função para mapear abreviações de estados para nomes completos e vice-versa
const getStateVariations = (state: string): string[] => {
  const stateMap: Record<string, string[]> = {
    'sp': ['são paulo', 'sp', 'sao paulo'],
    'rj': ['rio de janeiro', 'rj'],
    'mg': ['minas gerais', 'mg'],
    'são paulo': ['sp', 'sao paulo', 'são paulo'],
    'sao paulo': ['sp', 'são paulo', 'sao paulo'],
    'rio de janeiro': ['rj', 'rio de janeiro'],
    'minas gerais': ['mg', 'minas gerais'],
    // Adicione mais estados conforme necessário
  };
  
  const normalized = normalizeString(state);
  return stateMap[normalized] || [normalized];
};

// Função auxiliar para verificar se um item está em um array, ignorando case e trim
const isInArray = (array: string[], value: string): boolean => {
  const normalizedValue = normalizeString(value);
  return array.some(item => normalizeString(item) === normalizedValue);
};

// Função auxiliar para comparar strings, ignorando case e trim
const stringsMatch = (str1: string, str2: string): boolean => {
  return normalizeString(str1) === normalizeString(str2);
};

// Função auxiliar para verificar se uma string contém outra, ignorando case e trim
// Agora também lida com abreviações de estados
const stringContains = (str: string, searchStr: string): boolean => {
  const normalizedStr = normalizeString(str);
  const normalizedSearch = normalizeString(searchStr);
  
  // Verificação direta se a string contém a busca
  if (normalizedStr.includes(normalizedSearch)) return true;
  
  // Verificação de variações de estados (abreviações e nomes completos)
  const variations = getStateVariations(searchStr);
  return variations.some(variation => normalizedStr.includes(variation));
};

export const filterAuctions = (auctions: AuctionItem[], filters: FilterState): AuctionItem[] => {
  return auctions.filter(auction => {
    // Filtro de localização - aplicar apenas se não for o valor padrão
    if (filters.location && filters.location !== 'todos') {
      // Verificar se a localização do leilão contém o texto de filtro
      // ou se corresponde a uma abreviação de estado
      const locationMatch = stringContains(auction.location, filters.location);
      if (!locationMatch) return false;
    }
    
    // Filtro de tipo de veículo - aplicar apenas se não estiver vazio
    if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes('todos')) {
      // Verificar se o tipo de veículo está na lista de tipos selecionados
      // Mapear os tipos para valores compatíveis com os dados mockados
      const typeMap: Record<string, string> = {
        'carros': 'car',
        'motos': 'motorcycle',
        'caminhoes': 'truck'
      };
      
      // Converter o tipo de veículo do filtro para o valor no mock de dados
      let found = false;
      for (const type of filters.vehicleTypes) {
        const mappedType = typeMap[type] || type;
        if (stringsMatch(mappedType, auction.vehicleInfo.type)) {
          found = true;
          break;
        }
      }
      
      if (!found) return false;
    }
    
    // Filtro de marca - aplicar apenas se não for o valor padrão
    if (filters.brand !== DEFAULT_FILTERS.brand) {
      // Converter para lowercase para evitar problemas de case sensitivity
      const brandMatch = stringsMatch(filters.brand, auction.vehicleInfo.brand);
      if (!brandMatch) return false;
    }
    
    // Filtro de modelo - aplicar apenas se não for o valor padrão
    if (filters.model !== DEFAULT_FILTERS.model) {
      // Verificar se o modelo do veículo contém o texto de filtro
      const modelMatch = stringContains(auction.vehicleInfo.model, filters.model);
      if (!modelMatch) return false;
    }
    
    // Filtro de cor - aplicar apenas se não for o valor padrão
    if (filters.color !== DEFAULT_FILTERS.color) {
      // Verificar se a cor do veículo corresponde ao filtro
      const colorMatch = stringsMatch(filters.color, auction.vehicleInfo.color);
      if (!colorMatch) return false;
    }
    
    // Filtro de ano - aplicar apenas se min ou max estiver definido
    if (filters.year.min && auction.vehicleInfo.year < parseInt(filters.year.min)) {
      return false;
    }
    if (filters.year.max && auction.vehicleInfo.year > parseInt(filters.year.max)) {
      return false;
    }
    
    // Filtro de preço - aplicar apenas se min ou max estiver definido
    if (filters.price.range.min && auction.currentBid < parseInt(filters.price.range.min)) {
      return false;
    }
    if (filters.price.range.max && auction.currentBid > parseInt(filters.price.range.max)) {
      return false;
    }
    
    // Filtro de formato - aplicar apenas se não for o valor padrão
    if (filters.format !== DEFAULT_FILTERS.format) {
      const formatMatch = stringsMatch(filters.format, auction.format);
      if (!formatMatch) return false;
    }
    
    // Filtro de origem - aplicar apenas se não for o valor padrão
    if (filters.origin !== DEFAULT_FILTERS.origin) {
      const originMatch = stringsMatch(filters.origin, auction.origin);
      if (!originMatch) return false;
    }
    
    // Filtro de etapa - aplicar apenas se não for o valor padrão
    if (filters.place !== DEFAULT_FILTERS.place) {
      const placeMatch = stringsMatch(filters.place, auction.place);
      if (!placeMatch) return false;
    }
    
    return true;
  });
};
