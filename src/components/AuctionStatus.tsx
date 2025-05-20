import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFilterStore } from '@/stores/useFilterStore';
import { useSortStore } from '@/stores/useSortStore';
import { filterAuctions } from '@/utils/auctionUtils';
import { sampleAuctions } from '@/data/sampleAuctions';
import { sampleProperties } from '@/data/sampleProperties';
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
  const {
    filters
  } = useFilterStore();
  const {
    sortOption
  } = useSortStore();
  const stats = useMemo(() => {
    const contentType = filters.contentType;
    if (contentType === 'property') {
      // Handle properties counting
      const totalProperties = sampleProperties.length;
      const uniqueLocations = new Set(sampleProperties.map(property => property.location));
      const totalSites = uniqueLocations.size;
      // For properties, we'll consider 20% as "new" for demonstration
      const newProperties = Math.round(totalProperties * 0.2);
      return {
        totalItems: totalProperties,
        totalSites,
        newItems: newProperties
      };
    } else {
      // Default vehicle/auction handling
      const filteredAuctions = filterAuctions(sampleAuctions, filters);
      const totalAuctions = filteredAuctions.length;
      const totalSites = calculateTotalSites(filteredAuctions);
      const newAuctions = calculateNewAuctions(filteredAuctions);
      return {
        totalItems: totalAuctions,
        totalSites,
        newItems: newAuctions
      };
    }
  }, [filters]);

  // Don't display if there are no items
  if (stats.totalItems === 0) {
    return null;
  }

  // Text varies based on content type
  const itemType = filters.contentType === 'property' ? 'imóveis' : 'leilões';
  return <motion.div initial={{
    opacity: 0,
    y: -10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }} className="w-fit">
      Encontramos <span className="text-foreground font-medium">{stats.totalItems.toLocaleString('pt-BR')}</span> {itemType} em{' '}
      <span className="text-foreground font-medium">{stats.totalSites.toLocaleString('pt-BR')}</span> sites ·{' '}
      <span className="text-accent2-600 font-medium">{stats.newItems.toLocaleString('pt-BR')}</span> novos hoje
    </motion.div>;
};
export default React.memo(AuctionStatus);