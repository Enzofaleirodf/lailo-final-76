
import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuctionCardSkeleton from '@/components/AuctionCardSkeleton';
import LoadingState from '@/components/LoadingState';
import ErrorBoundary from '@/components/ErrorBoundary';
import LazyAuctionCard from '@/components/optimized/LazyAuctionCard';
import { useFilterStore } from '@/stores/useFilterStore';
import { useAuctionItems } from '@/hooks/useAuctionItems';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { usePagination } from '@/hooks/usePagination';
import AuctionPagination from './pagination/AuctionPagination';
import EmptyStateMessage from './EmptyStateMessage';
import { measurePerformance } from '@/utils/performanceUtils';

const ITEMS_PER_PAGE = 30;
const SKELETON_COUNT = 6;

const AuctionList: React.FC = () => {
  const { filters } = useFilterStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const {
    items,
    loading,
    isChangingPage,
    totalPages,
    error
  } = useAuctionItems({
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const { navigateToPage } = usePagination({ totalPages });

  // Memoizar skeletons para evitar re-renders desnecessários
  const skeletons = useMemo(() => (
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
  ), [filters.contentType]);

  // Garantir que o número da página seja válido
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      setSearchParams(params);
    }
  }, [totalPages, currentPage, searchParams, setSearchParams]);

  // Tratar estado de erro
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-brand-600 hover:text-brand-700 underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Mostrar loading state durante o carregamento inicial
  if (loading && !isChangingPage) {
    return <LoadingState text="Carregando resultados..." />;
  }

  // Mostrar estado vazio quando nenhum item for encontrado
  if (items.length === 0 && !loading) {
    return <EmptyStateMessage contentType={filters.contentType} />;
  }

  // Renderizar a lista de itens com paginação
  return (
    <ErrorBoundary>
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
            {isChangingPage && skeletons}
            
            {/* Mostrar a lista de itens */}
            {!isChangingPage && (
              <>
                <div className="sr-only" role="status">
                  {items.length} {filters.contentType === 'property' ? 'imóveis' : 'leilões'} encontrados
                </div>
                
                {items.map((item, index) => {
                  if (!item) {
                    if (process.env.NODE_ENV === 'development') {
                      console.error('Null item found in items array at index:', index);
                    }
                    return null;
                  }

                  const perf = measurePerformance(`Render item ${index}`);
                  
                  const result = (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05
                      }} 
                      className="mt-0 pt-0 mb-2"
                    >
                      <LazyAuctionCard 
                        item={item} 
                        contentType={filters.contentType} 
                      />
                    </motion.div>
                  );
                  
                  perf.end();
                  return result;
                })}
              </>
            )}
          </motion.div>
        </AnimatePresence>
        
        <AuctionPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={navigateToPage} 
        />
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(AuctionList);
