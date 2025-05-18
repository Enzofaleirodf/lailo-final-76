import React, { useState, useEffect, useCallback } from 'react';
import AuctionCard from '@/components/AuctionCard';
import AuctionCardSkeleton from '@/components/AuctionCardSkeleton';
import { sampleAuctions } from '@/data/sampleAuctions';
import { sortAuctions, filterAuctions } from '@/utils/auctionUtils';
import { toast } from '@/components/ui/sonner';
import { useSearchParams } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';

const ITEMS_PER_PAGE = 30;

const AuctionList: React.FC = () => {
  const { filters } = useFilterStore();
  const { sortOption } = useSortStore();
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const [isChangingPage, setIsChangingPage] = useState(false);
  
  // Use callback to prevent recreation on each render
  const fetchAuctions = useCallback(async () => {
    try {
      setIsChangingPage(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call with pagination
      const filteredAuctions = filterAuctions(sampleAuctions, filters);
      const sortedAuctions = sortAuctions(filteredAuctions, sortOption);
      
      // Calculate total pages
      const total = Math.ceil(sortedAuctions.length / itemsPerPage);
      setTotalPages(total > 0 ? total : 1);
      
      // Apply pagination
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedAuctions = sortedAuctions.slice(start, end);
      
      setAuctions(paginatedAuctions);
      setLoading(false);
      setTimeout(() => setIsChangingPage(false), 300); // Small delay for smoother animation
    } catch (error) {
      console.error('Error processing auctions:', error);
      toast.error('Ocorreu um erro ao carregar os leilões');
      setLoading(false);
      setIsChangingPage(false);
    }
  }, [filters, sortOption, currentPage, itemsPerPage]);

  // Ensure valid page number
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      setSearchParams(params);
    }
  }, [totalPages, currentPage, searchParams, setSearchParams]);

  useEffect(() => {
    setLoading(true);
    fetchAuctions();
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchAuctions]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const renderPaginationItems = useCallback(() => {
    const items = [];
    const maxVisible = window.innerWidth < 640 ? 3 : 5; // Less numbers on mobile
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => handlePageChange(1)}
          className="transition-all duration-200 hover:scale-105"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 2);
    
    if (endPage - startPage < maxVisible - 2) {
      startPage = Math.max(2, endPage - maxVisible + 2);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => handlePageChange(i)}
            className="transition-all duration-200 hover:scale-105"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => handlePageChange(totalPages)}
            className="transition-all duration-200 hover:scale-105"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  }, [currentPage, handlePageChange, totalPages]);
  
  if (loading && !isChangingPage) {
    return (
      <div className="flex flex-col space-y-4">
        {[...Array(6)].map((_, index) => (
          <AuctionCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (auctions.length === 0 && !isChangingPage) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum item encontrado</h3>
        <p className="text-gray-500 mb-4">Tente ajustar seus filtros para encontrar mais opções</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={isChangingPage ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col space-y-4"
        >
          {auctions.map((auction) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
            >
              <AuctionCard auction={auction} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-4"
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={`${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'hover:scale-105 transition-transform'}`}
                  aria-disabled={currentPage <= 1}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={`${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'hover:scale-105 transition-transform'}`}
                  aria-disabled={currentPage >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(AuctionList);
