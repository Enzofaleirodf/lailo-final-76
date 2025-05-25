
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuctionCard from '@/components/AuctionCard';
import PropertyCard from '@/components/PropertyCard';
import AuctionCardSkeleton from '@/components/AuctionCardSkeleton';
import { useFilterStore } from '@/stores/useFilterStore';
import { useAuctionItems } from '@/hooks/useAuctionItems';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { MAGIC_NUMBERS } from '@/constants/designSystem';
import ErrorBoundary from './ErrorBoundary';
import { handleError } from '@/utils/errorUtils';
import { usePagination } from '@/hooks/usePagination';
import AuctionPagination from './pagination/AuctionPagination';
import EmptyStateMessage from './EmptyStateMessage';

// Definimos 30 itens por página conforme requisito
const ITEMS_PER_PAGE = MAGIC_NUMBERS.itemsPerPage;
const SKELETON_COUNT = MAGIC_NUMBERS.skeletonCount;

const AuctionList: React.FC = () => {
  const { filters } = useFilterStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Usar nosso novo hook personalizado para gerenciar itens
  const {
    items,
    loading,
    isChangingPage,
    totalPages
  } = useAuctionItems({
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE
  });

  // Usar hook de paginação para navegação
  const { navigateToPage } = usePagination({ totalPages });

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
    <div 
      className="flex flex-col space-y-3" 
      aria-label="Carregando conteúdo" 
      role="status"
    >
      {[...Array(SKELETON_COUNT)].map((_, index) => (
        <AuctionCardSkeleton key={index} />
      ))}
      <span className="sr-only">
        Carregando {filters.contentType === 'property' ? 'imóveis' : 'leilões'}
      </span>
    </div>
  );

  // Mostrar esqueleto durante o carregamento inicial
  if (loading && !isChangingPage) {
    return renderSkeletons();
  }

  // Mostrar estado vazio quando nenhum item for encontrado
  if (items.length === 0 && !loading) {
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
                {items.length} {filters.contentType === 'property' ? 'imóveis' : 'leilões'} encontrados
              </div>
              
              {items.map(item => {
                if (!item) {
                  handleError(new Error('Null item found in items array'), 'AuctionList');
                  return null;
                }

                // Determinar qual componente de card usar com base no tipo de conteúdo
                if (filters.contentType === 'property') {
                  // Type guard para garantir que este é um PropertyItem com os campos necessários
                  const property = item as PropertyItem;
                  return (
                    <ErrorBoundary key={property.id} componentName={`PropertyCard-${property.id}`}>
                      <motion.div 
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: Math.random() * 0.2
                        }} 
                        className="mt-0 pt-0 mb-2"
                      >
                        <PropertyCard property={property} />
                      </motion.div>
                    </ErrorBoundary>
                  );
                } else {
                  // Para leilões de veículos, usar o AuctionCard existente
                  const auction = item as AuctionItem;
                  return (
                    <ErrorBoundary key={auction.id} componentName={`AuctionCard-${auction.id}`}>
                      <motion.div 
                        key={auction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: Math.random() * 0.2
                        }} 
                        className="mt-0 pt-0 mb-2"
                      >
                        <AuctionCard auction={auction} />
                      </motion.div>
                    </ErrorBoundary>
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
        onPageChange={navigateToPage} 
      />
    </div>
  );
};

export default React.memo(AuctionList);
