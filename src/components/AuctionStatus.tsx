
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { filterAuctions } from '@/utils/auctionUtils';
import { sampleAuctions } from '@/data/sampleAuctions';
import { AuctionItem } from '@/types/auction';

// Helper functions for counting
export const calculateTotalSites = (auctions: AuctionItem[]): number => {
  // Since we're working with sample data and don't have website field,
  // we'll simulate websites based on location for demonstration purposes
  const uniqueLocations = new Set(auctions.map(auction => auction.location));
  return uniqueLocations.size;
};

export const calculateNewAuctions = (auctions: AuctionItem[]): number => {
  // For demonstration, we'll consider auctions from the current year as "new"
  const today = new Date();
  const currentYear = today.getFullYear();
  
  return auctions.filter(auction => {
    return auction.vehicleInfo.year === currentYear;
  }).length;
};

const AuctionStatus: React.FC = () => {
  const { filters } = useFilterStore();
  const { sortOption } = useSortStore();
  
  const stats = useMemo(() => {
    const filteredAuctions = filterAuctions(sampleAuctions, filters);
    const totalAuctions = filteredAuctions.length;
    const totalSites = calculateTotalSites(filteredAuctions);
    const newAuctions = calculateNewAuctions(filteredAuctions);
    
    return {
      totalAuctions,
      totalSites,
      newAuctions
    };
  }, [filters]);
  
  // Don't display if there are no auctions
  if (stats.totalAuctions === 0) {
    return null;
  }
  
  return (
    <motion.div 
      className="text-sm" // Removed mb-4 to fix vertical alignment
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      Encontramos <span className="text-foreground font-medium">{stats.totalAuctions.toLocaleString('pt-BR')}</span> leilões em{' '}
      <span className="text-foreground font-medium">{stats.totalSites.toLocaleString('pt-BR')}</span> sites ·{' '}
      <span className="text-foreground font-medium">{stats.newAuctions.toLocaleString('pt-BR')}</span> novos hoje
    </motion.div>
  );
};

export default React.memo(AuctionStatus);
