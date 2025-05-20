import React, { useState, useEffect, useCallback, useRef } from 'react';
import AuctionCard from '@/components/AuctionCard';
import PropertyCard from '@/components/PropertyCard';
import AuctionCardSkeleton from '@/components/AuctionCardSkeleton';
import { sampleAuctions } from '@/data/sampleAuctions';
import { sampleProperties } from '@/data/sampleProperties';
import { sortAuctions, filterAuctions } from '@/utils/auctionUtils';
import { toast } from '@/components/ui/sonner';
import { useSearchParams } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';

const ITEMS_PER_PAGE = 30;

const AuctionList: React.FC = () => {
  const { filters, resetFilters, updateFilter } = useFilterStore();
  const { sortOption } = useSortStore();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AuctionItem[] | PropertyItem[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [lastContentType, setLastContentType] = useState<string | null>(null);
  
  // Reference to track page changes
  const isPageChangeRef = useRef(false);
  
  // Use callback to prevent recreation on each render
  const fetchItems = useCallback(async () => {
    try {
      setIsChangingPage(true);
      
      // Check if content type changed since last fetch
      if (lastContentType !== null && lastContentType !== filters.contentType) {
        // When content type changes, we should clear vehicle/property specific filters
        console.log(`Content type changed from ${lastContentType} to ${filters.contentType}`);
      }
      
      // Update last content type
      setLastContentType(filters.contentType);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const contentType = filters.contentType;
      let filteredItems = [];
      
      // Check for URL parameters that might override filter state
      const priceMin = searchParams.get('priceMin');
      const priceMax = searchParams.get('priceMax');
      
      // If URL has price parameters but filter doesn't, update the filter
      if ((priceMin || priceMax) && (!filters.price.range.min || !filters.price.range.max)) {
        console.log(`Updating price filter from URL: min=${priceMin}, max=${priceMax}`);
        updateFilter('price', {
          ...filters.price,
          range: {
            min: priceMin || filters.price.range.min,
            max: priceMax || filters.price.range.max
          }
        });
      }
      
      if (contentType === 'property') {
        console.log('Fetching property items with filters:', filters);
        
        // For properties, we'll work with the sample properties data
        filteredItems = sampleProperties.filter(property => {
          // Basic filtering for properties
          let matches = true;
          
          // Apply price filter if set
          if (filters.price.range.min || priceMin) {
            const minPrice = parseInt(filters.price.range.min || priceMin || '0');
            matches = matches && property.currentBid >= minPrice;
          }
          
          if (filters.price.range.max || priceMax) {
            const maxPrice = parseInt(filters.price.range.max || priceMax || '999999999');
            matches = matches && property.currentBid <= maxPrice;
          }
          
          // Apply property type filter if set
          if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes('todos')) {
            if (property.propertyInfo && property.propertyInfo.type) {
              matches = matches && filters.propertyTypes.includes(property.propertyInfo.type);
            }
          }
          
          // Apply useful area filter if set
          if (filters.usefulArea.min && property.propertyInfo) {
            matches = matches && property.propertyInfo.usefulAreaM2 >= parseInt(filters.usefulArea.min);
          }
          if (filters.usefulArea.max && property.propertyInfo) {
            matches = matches && property.propertyInfo.usefulAreaM2 <= parseInt(filters.usefulArea.max);
          }
          
          // Apply format filter if needed
          if (filters.format !== 'Todos') {
            matches = matches && property.format === filters.format;
          }
          
          // Apply origin filter if needed
          if (filters.origin !== 'Todas') {
            matches = matches && property.origin === filters.origin;
          }
          
          // Apply place filter if needed
          if (filters.place !== 'Todas') {
            matches = matches && property.place === filters.place;
          }
          
          return matches;
        });
        
        console.log(`After filtering: ${filteredItems.length} properties match the criteria`);
        
        // Sort properties based on the selected option
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
        
        // Show a sample of the first item for debugging
        if (filteredItems.length > 0) {
          console.log('First property item:', filteredItems[0]);
        } else {
          console.warn('No property items matched the filters');
        }
        
      } else {
        // Vehicle handling (keep existing code)
        filteredItems = filterAuctions(sampleAuctions, filters);
        filteredItems = sortAuctions(filteredItems, sortOption);
      }
      
      // Calculate total pages
      const total = Math.ceil(filteredItems.length / itemsPerPage);
      setTotalPages(total > 0 ? total : 1);
      
      // Apply pagination
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedItems = filteredItems.slice(start, end);
      
      // Debug the items being rendered
      console.log(`[AuctionList] Content type: ${contentType}, Items count: ${paginatedItems.length}`);
      
      setItems(paginatedItems);
      setLoading(false);
      setTimeout(() => setIsChangingPage(false), 300); // Small delay for smoother animation
    } catch (error) {
      console.error('Error processing items:', error);
      toast.error(`Ocorreu um erro ao carregar os itens`);
      setLoading(false);
      setIsChangingPage(false);
    }
  }, [filters, sortOption, currentPage, itemsPerPage, lastContentType, searchParams, updateFilter]);

  // Effect to handle content type changes and filter cleanup
  useEffect(() => {
    if (lastContentType !== null && lastContentType !== filters.contentType) {
      // A change in content type occurred - let's clean up irrelevant filters
      const cleanedFilters = { ...filters };
      
      if (filters.contentType === 'property') {
        // When switching to properties, clear vehicle-specific filters
        cleanedFilters.vehicleTypes = [];
        cleanedFilters.brand = 'todas';
        cleanedFilters.model = 'todos';
        cleanedFilters.color = 'todas';
        cleanedFilters.year = { min: '', max: '' };
      } else {
        // When switching to vehicles, clear property-specific filters
        cleanedFilters.propertyTypes = [];
        cleanedFilters.usefulArea = { min: '', max: '' };
      }
      
      // Reset the page to 1 when content type changes
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      setSearchParams(params, { replace: true });
    }
  }, [filters.contentType, lastContentType, filters, searchParams, setSearchParams]);

  // Ensure valid page number
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      setSearchParams(params);
    }
  }, [totalPages, currentPage, searchParams, setSearchParams]);

  // Effect to fetch data and handle scroll behavior on page changes
  useEffect(() => {
    setLoading(true);
    fetchItems();
    
    // Scroll to top ONLY on explicit page changes
    if (isPageChangeRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      isPageChangeRef.current = false;
    }
  }, [fetchItems]);

  const handlePageChange = useCallback((page: number) => {
    // Mark that we're changing pages explicitly
    isPageChangeRef.current = true;
    
    // Capture current scroll position before changing page
    const currentScrollPosition = window.scrollY;
    
    const params = new URLSearchParams(searchParams);
    
    // If we're going to the same page, do nothing
    if (page.toString() === params.get('page')) {
      return;
    }
    
    params.set('page', page.toString());
    
    // Create and dispatch a custom event before changing page
    const event = new CustomEvent('page:changing', {
      detail: { 
        fromPage: currentPage,
        toPage: page,
        scrollPosition: currentScrollPosition
      }
    });
    window.dispatchEvent(event);
    
    // Update search params to change page
    setSearchParams(params);
  }, [searchParams, setSearchParams, currentPage]);

  // Render pagination items based on total pages and current page
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
  
  // Show skeleton during initial loading
  if (loading && !isChangingPage) {
    return (
      <div className="flex flex-col space-y-3">
        {[...Array(6)].map((_, index) => (
          <AuctionCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show empty state when no items are found
  if (items.length === 0 && !isChangingPage) {
    const contentTypeLabel = filters.contentType === 'property' ? 'imóveis' : 'leilões';
    
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
        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum {contentTypeLabel} encontrado</h3>
        <p className="text-gray-500 mb-4">Tente ajustar seus filtros para encontrar mais opções</p>
      </motion.div>
    );
  }

  // Render the items list with pagination
  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={isChangingPage ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col space-y-3"
        >
          {items.map((item) => {
            if (!item) {
              console.error('Null item found in items array');
              return null;
            }
            
            // Determine which card component to use based on content type
            if (filters.contentType === 'property') {
              // Type guard to ensure this is a PropertyItem with required fields
              const property = item as PropertyItem;
              
              // Enhanced validation for property items
              if (!property.id || property.currentBid === undefined) {
                console.error('Invalid property data:', property);
                return null;
              }
              
              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              );
            } else {
              // For vehicle auctions, use the existing AuctionCard
              const auction = item as AuctionItem;
              
              return (
                <motion.div
                  key={auction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
                >
                  <AuctionCard auction={auction} />
                </motion.div>
              );
            }
          })}
        </motion.div>
      </AnimatePresence>
      
      {/* Pagination section */}
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
