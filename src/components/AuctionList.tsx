
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuctionCard from '@/components/AuctionCard';
import PropertyCard from '@/components/PropertyCard';
import AuctionCardSkeleton from '@/components/AuctionCardSkeleton';
import { useFilterStore } from '@/stores/useFilterStore';
import { useAuctionItems } from '@/hooks/useAuctionItems';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { useUrlParams } from '@/hooks/useUrlParams';
import AuctionPagination from './pagination/AuctionPagination';
import EmptyStateMessage from './EmptyStateMessage';

// Definimos 30 itens por página conforme requisito
const ITEMS_PER_PAGE = 30;
const SKELETON_COUNT = 6;

// Generate multiple pages of mock data for testing pagination
const generateMockItems = (contentType: string, count: number) => {
  const items = [];
  
  for (let i = 0; i < count; i++) {
    if (contentType === 'property') {
      items.push({
        id: `property-${i + 1}`,
        title: `Imóvel Teste ${i + 1}`,
        description: `Descrição do imóvel teste ${i + 1}`,
        address: `Rua Teste ${i + 1}, Bairro ${i % 10 + 1}`,
        location: `Cidade ${i % 10 + 1}, Estado ${i % 5 + 1}`,
        currentBid: 100000 + (i * 10000),
        originalPrice: i % 3 === 0 ? 130000 + (i * 15000) : undefined,
        endDate: new Date(Date.now() + (86400000 * (i % 30 + 1))),
        propertyInfo: {
          type: i % 2 === 0 ? 'Apartamento' : 'Casa',
          usefulAreaM2: 50 + (i * 5),
          bedrooms: (i % 5) + 1,
          bathrooms: (i % 3) + 1,
          garageSpots: i % 4
        },
        images: [`https://picsum.photos/id/${(i % 20) + 100}/400/300`],
        origin: i % 4 === 0 ? 'Judicial' : i % 4 === 1 ? 'Extrajudicial' : 'Banco',
        place: i % 3 === 0 ? 'Rio de Janeiro' : i % 3 === 1 ? 'São Paulo' : 'Minas Gerais'
      });
    } else {
      items.push({
        id: `auction-${i + 1}`,
        title: `Veículo Teste ${i + 1}`,
        description: `Descrição do veículo teste ${i + 1}`,
        currentBid: 10000 + (i * 1000),
        startPrice: 8000 + (i * 800),
        endDate: new Date(Date.now() + (86400000 * (i % 30 + 1))),
        vehicle: {
          make: `Marca ${i % 10 + 1}`,
          model: `Modelo ${i % 20 + 1}`,
          year: 2010 + (i % 14),
          mileage: 10000 + (i * 1000),
          color: i % 2 === 0 ? 'Preto' : 'Branco',
          fuel: i % 3 === 0 ? 'Gasolina' : 'Flex'
        },
        images: [`https://picsum.photos/id/${(i % 20) + 200}/400/300`],
        status: i % 4 === 0 ? 'open' : i % 4 === 1 ? 'upcoming' : i % 4 === 2 ? 'closed' : 'sold'
      });
    }
  }
  
  return items;
};

const AuctionList: React.FC = () => {
  const { filters } = useFilterStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { handlePageChange } = useUrlParams();
  const [mockItems, setMockItems] = useState([]);
  const [totalPages, setTotalPages] = useState(5); // Default to 5 pages for testing

  // Create a lot of mock items for pagination testing
  useEffect(() => {
    // Generate 150 items (5 pages with 30 items per page) for each content type
    const count = 150;
    const items = generateMockItems(filters.contentType, count);
    setMockItems(items);
    setTotalPages(Math.ceil(items.length / ITEMS_PER_PAGE));
  }, [filters.contentType]);

  // Calculate current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return mockItems.slice(startIndex, endIndex);
  };

  const [loading, setLoading] = useState(true);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const currentItems = getCurrentPageItems();

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    setIsChangingPage(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
      setIsChangingPage(false);
    }, 700);
    
    return () => clearTimeout(timer);
  }, [currentPage, filters.contentType]);

  // Garantir que o número da página seja válido
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      setSearchParams(params);
    }
  }, [totalPages, currentPage, searchParams, setSearchParams]);

  // Renderizar lista de esqueletos durante o carregamento
  const renderSkeletons = () => (
    <div className="flex flex-col space-y-3" aria-label="Carregando conteúdo" role="status">
      {[...Array(SKELETON_COUNT)].map((_, index) => (
        <AuctionCardSkeleton key={index} />
      ))}
      <span className="sr-only">Carregando {filters.contentType === 'property' ? 'imóveis' : 'leilões'}</span>
    </div>
  );

  // Mostrar esqueleto durante o carregamento inicial
  if (loading && !isChangingPage) {
    return renderSkeletons();
  }

  // Mostrar estado vazio quando nenhum item for encontrado
  if (currentItems.length === 0 && !loading) {
    return <EmptyStateMessage contentType={filters.contentType} />;
  }

  // Renderizar a lista de itens com paginação
  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={`page-${currentPage}`}
          initial={isChangingPage ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          aria-live="polite"
          className="flex flex-col space-y-0"
        >
          {/* Mostrar skeletons durante a mudança de página */}
          {isChangingPage && renderSkeletons()}
          
          {/* Mostrar a lista de itens */}
          {!isChangingPage && (
            <>
              <div className="sr-only" role="status">
                {currentItems.length} {filters.contentType === 'property' ? 'imóveis' : 'leilões'} encontrados
              </div>
              {currentItems.map(item => {
                if (!item) {
                  console.error('Null item found in items array');
                  return null;
                }

                // Determinar qual componente de card usar com base no tipo de conteúdo
                if (filters.contentType === 'property') {
                  // Type guard para garantir que este é um PropertyItem com os campos necessários
                  const property = item as PropertyItem;
                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
                      className="mt-0 pt-0 mb-1"
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  );
                } else {
                  // Para leilões de veículos, usar o AuctionCard existente
                  const auction = item as AuctionItem;
                  return (
                    <motion.div
                      key={auction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
                      className="mt-0 pt-0 mb-1"
                    >
                      <AuctionCard auction={auction} />
                    </motion.div>
                  );
                }
              })}
            </>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Componente de paginação extraído - mostrar mesmo durante carregamento para melhor UX */}
      <AuctionPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default React.memo(AuctionList);
