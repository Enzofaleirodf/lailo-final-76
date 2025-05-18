
import React, { useState, useEffect, useCallback } from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { useSort } from '@/contexts/SortContext';
import AuctionCard from '@/components/AuctionCard';
import AuctionCardSkeleton from '@/components/AuctionCardSkeleton';
import { sampleAuctions } from '@/data/sampleAuctions';
import { sortAuctions, filterAuctions, useFilteredAndSortedAuctions } from '@/utils/auctionUtils';
import { toast } from '@/components/ui/sonner';

const AuctionList: React.FC = () => {
  const { filters } = useFilter();
  const { sortOption } = useSort();
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);

  // Use callback to prevent recreation on each render
  const fetchAuctions = useCallback(async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call
      const filteredAuctions = filterAuctions(sampleAuctions, filters);
      const sortedAuctions = sortAuctions(filteredAuctions, sortOption);
      setAuctions(sortedAuctions);
      setLoading(false);
    } catch (error) {
      console.error('Error processing auctions:', error);
      toast.error('Ocorreu um erro ao carregar os leilões');
      setLoading(false);
    }
  }, [filters, sortOption]);

  useEffect(() => {
    setLoading(true);
    fetchAuctions();
  }, [fetchAuctions]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <AuctionCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum item encontrado</h3>
        <p className="text-gray-500 mb-4">Tente ajustar seus filtros para encontrar mais opções</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
};

export default React.memo(AuctionList);
