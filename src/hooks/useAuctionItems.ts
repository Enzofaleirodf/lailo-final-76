
import { useState, useEffect, useCallback } from 'react';
import { sampleAuctions } from '@/data/sampleAuctions';
import { sampleProperties } from '@/data/sampleProperties';
import { sortAuctions, filterAuctions } from '@/utils/auctionUtils';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { useResultsStore } from '@/stores/useResultsStore';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { toast } from '@/components/ui/sonner';

interface UseAuctionItemsOptions {
  currentPage: number;
  itemsPerPage: number;
}

export const useAuctionItems = ({ currentPage, itemsPerPage }: UseAuctionItemsOptions) => {
  const { filters } = useFilterStore();
  const { sortOption } = useSortStore();
  const { setFilteredResults, setLoading } = useResultsStore();
  const [loading, setLocalLoading] = useState(true);
  const [items, setItems] = useState<AuctionItem[] | PropertyItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [lastContentType, setLastContentType] = useState<string | null>(null);
  
  // Use callback to prevent recreation on each render
  const fetchItems = useCallback(async () => {
    try {
      setIsChangingPage(true);
      setLoading(true);
      setLocalLoading(true);
      
      // Check if content type changed since last fetch
      if (lastContentType !== null && lastContentType !== filters.contentType) {
        console.log(`Content type changed from ${lastContentType} to ${filters.contentType}`);
      }
      
      // Update last content type
      setLastContentType(filters.contentType);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const contentType = filters.contentType;
      let filteredItems = [];
      
      if (contentType === 'property') {
        console.log('Fetching property items with filters:', JSON.stringify(filters, null, 2));
        
        // Começar com todos os itens (sem filtro)
        filteredItems = [...sampleProperties];
        
        // Só aplicar filtros que não estão com valores padrão
        
        // Aplicar filtro de preço, se definido
        if (filters.price.range.min) {
          const minPrice = Number(filters.price.range.min);
          filteredItems = filteredItems.filter(property => property.currentBid >= minPrice);
        }
        
        if (filters.price.range.max) {
          const maxPrice = Number(filters.price.range.max);
          filteredItems = filteredItems.filter(property => property.currentBid <= maxPrice);
        }
        
        // Aplicar filtro de tipo de propriedade, se definido e não for o padrão (vazio)
        if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes('todos')) {
          filteredItems = filteredItems.filter(property => {
            if (property.propertyInfo && property.propertyInfo.type) {
              return filters.propertyTypes.includes(property.propertyInfo.type.toLowerCase());
            }
            return false;
          });
        }
        
        // Aplicar filtro de área útil, se definido
        if (filters.usefulArea.min && filters.usefulArea.min.trim() !== '') {
          const minArea = Number(filters.usefulArea.min);
          filteredItems = filteredItems.filter(property => {
            return property.propertyInfo && property.propertyInfo.usefulAreaM2 >= minArea;
          });
        }
        
        if (filters.usefulArea.max && filters.usefulArea.max.trim() !== '') {
          const maxArea = Number(filters.usefulArea.max);
          filteredItems = filteredItems.filter(property => {
            return property.propertyInfo && property.propertyInfo.usefulAreaM2 <= maxArea;
          });
        }
        
        // Aplicar filtro de localização, se definido
        if (filters.location.state || filters.location.city) {
          filteredItems = filteredItems.filter(property => {
            let matchState = !filters.location.state || 
              (property.stateCode && property.stateCode.toLowerCase() === filters.location.state.toLowerCase());
            
            let matchCity = !filters.location.city || 
              (property.city && property.city.toLowerCase() === filters.location.city.toLowerCase());
            
            return matchState && matchCity;
          });
        }
        
        // Aplicar filtro de formato, apenas se não for o valor padrão visual
        if (filters.format !== 'Leilão') {
          filteredItems = filteredItems.filter(property => property.format === filters.format);
        }
        
        // Aplicar filtro de origem, apenas se não for o valor padrão
        if (filters.origin !== 'Todas') {
          filteredItems = filteredItems.filter(property => property.origin === filters.origin);
        }
        
        // Aplicar filtro de etapa, apenas se não for o valor padrão
        if (filters.place !== 'Todas') {
          filteredItems = filteredItems.filter(property => property.place === filters.place);
        }
        
        // Ordenar propriedades com base na opção de ordenação
        if (sortOption === 'price-asc') {
          filteredItems.sort((a, b) => a.currentBid - b.currentBid);
        } else if (sortOption === 'price-desc') {
          filteredItems.sort((a, b) => b.currentBid - a.currentBid);
        } else if (sortOption === 'newest') {
          filteredItems.sort((a, b) => {
            if (a.endDate && b.endDate) {
              return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
            }
            return 0;
          });
        }
        
        console.log(`Filtered ${filteredItems.length} properties after applying filters`);
        
      } else {
        // Para veículos, usar a lógica ajustada que não aplica filtros com valores padrão
        
        // Começar com todos os itens
        filteredItems = [...sampleAuctions];
        
        // Aplicar filtro de preço, se definido
        if (filters.price.range.min) {
          const minPrice = Number(filters.price.range.min);
          filteredItems = filteredItems.filter(auction => auction.currentBid >= minPrice);
        }
        
        if (filters.price.range.max) {
          const maxPrice = Number(filters.price.range.max);
          filteredItems = filteredItems.filter(auction => auction.currentBid <= maxPrice);
        }
        
        // Aplicar filtro de tipos de veículos, se não for o padrão (vazio)
        if (filters.vehicleTypes.length > 0) {
          filteredItems = filteredItems.filter(auction => {
            if (!auction.vehicleInfo || !auction.vehicleInfo.type) return false;
            return filters.vehicleTypes.includes(auction.vehicleInfo.type);
          });
        }
        
        // Aplicar filtro de marca, se não for o valor padrão
        if (filters.brand !== 'todas') {
          filteredItems = filteredItems.filter(auction => {
            if (!auction.vehicleInfo || !auction.vehicleInfo.brand) return false;
            return auction.vehicleInfo.brand.toLowerCase() === filters.brand.toLowerCase();
          });
        }
        
        // Aplicar filtro de modelo, se não for o valor padrão
        if (filters.model !== 'todos') {
          filteredItems = filteredItems.filter(auction => {
            if (!auction.vehicleInfo || !auction.vehicleInfo.model) return false;
            return auction.vehicleInfo.model.toLowerCase() === filters.model.toLowerCase();
          });
        }
        
        // Aplicar filtro de cor, se não for o valor padrão
        if (filters.color !== 'todas') {
          filteredItems = filteredItems.filter(auction => {
            if (!auction.vehicleInfo || !auction.vehicleInfo.color) return false;
            return auction.vehicleInfo.color.toLowerCase() === filters.color.toLowerCase();
          });
        }
        
        // Aplicar filtro de ano, se definido
        if (filters.year.min) {
          const minYear = Number(filters.year.min);
          filteredItems = filteredItems.filter(auction => {
            if (!auction.vehicleInfo || !auction.vehicleInfo.year) return false;
            return auction.vehicleInfo.year >= minYear;
          });
        }
        
        if (filters.year.max) {
          const maxYear = Number(filters.year.max);
          filteredItems = filteredItems.filter(auction => {
            if (!auction.vehicleInfo || !auction.vehicleInfo.year) return false;
            return auction.vehicleInfo.year <= maxYear;
          });
        }
        
        // Aplicar filtro de localização, se definido
        if (filters.location.state || filters.location.city) {
          filteredItems = filteredItems.filter(auction => {
            let matchState = !filters.location.state || 
              (auction.stateCode && auction.stateCode.toLowerCase() === filters.location.state.toLowerCase());
            
            let matchCity = !filters.location.city || 
              (auction.city && auction.city.toLowerCase() === filters.location.city.toLowerCase());
            
            return matchState && matchCity;
          });
        }
        
        // Aplicar filtro de formato, apenas se não for o valor padrão visual
        if (filters.format !== 'Leilão') {
          filteredItems = filteredItems.filter(auction => auction.format === filters.format);
        }
        
        // Aplicar filtro de origem, apenas se não for o valor padrão
        if (filters.origin !== 'Todas') {
          filteredItems = filteredItems.filter(auction => auction.origin === filters.origin);
        }
        
        // Aplicar filtro de etapa, apenas se não for o valor padrão
        if (filters.place !== 'Todas') {
          filteredItems = filteredItems.filter(auction => auction.place === filters.place);
        }
        
        // Ordenar
        if (sortOption === 'price-asc') {
          filteredItems.sort((a, b) => a.currentBid - b.currentBid);
        } else if (sortOption === 'price-desc') {
          filteredItems.sort((a, b) => b.currentBid - a.currentBid);
        } else if (sortOption === 'newest') {
          filteredItems.sort((a, b) => {
            if (a.endDate && b.endDate) {
              return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
            }
            return 0;
          });
        }
      }
      
      // Calcular estatísticas para o componente AuctionStatus
      const totalItems = filteredItems.length;
      
      // Calcular locais únicos
      const uniqueLocations = new Set(filteredItems.map(item => item.location));
      const totalSites = uniqueLocations.size > 0 ? uniqueLocations.size : 1;
      
      // Calcular novos itens - aproximadamente 10-20% do total para fins de demonstração
      const newItems = Math.ceil(filteredItems.length * (contentType === 'property' ? 0.2 : 0.1));
      
      // Atualizar a store de resultados com os valores calculados
      setFilteredResults(totalItems, totalSites, newItems);
      
      // Calcular total de páginas
      const total = Math.ceil(filteredItems.length / itemsPerPage);
      setTotalPages(total > 0 ? total : 1);
      
      // Aplicar paginação
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedItems = filteredItems.slice(start, end);
      
      // Debug dos itens renderizados
      console.log(`[AuctionList] Content type: ${contentType}, Items count: ${paginatedItems.length}`);
      
      setItems(paginatedItems);
      setLocalLoading(false);
      setLoading(false);
      setTimeout(() => setIsChangingPage(false), 300); // Pequeno atraso para animação mais suave
    } catch (error) {
      console.error('Error processing items:', error);
      
      // Mostrar mensagem de erro apropriada com base no tipo de conteúdo
      const contentTypeLabel = filters.contentType === 'property' ? 'imóveis' : 'leilões';
      toast.error(`Ocorreu um erro ao carregar os ${contentTypeLabel}`);
      
      setLocalLoading(false);
      setLoading(false);
      setIsChangingPage(false);
      setFilteredResults(0, 0, 0);
    }
  }, [filters, sortOption, currentPage, itemsPerPage, lastContentType, setFilteredResults, setLoading]);
  
  // Atualizar a lista quando qualquer dependência mudar
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  return {
    items,
    loading: loading || isChangingPage,
    isChangingPage,
    totalPages,
    fetchItems
  };
};
