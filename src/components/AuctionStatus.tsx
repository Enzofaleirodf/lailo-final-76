
import React, { useMemo, useEffect, useState } from 'react';
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
    return auction.vehicleInfo && auction.vehicleInfo.year === currentYear;
  }).length;
};

export const calculateNewProperties = (properties: any[]): number => {
  // For properties, we'll consider 20% as "new" for demonstration
  return Math.round(properties.length * 0.2);
};

const AuctionStatus: React.FC = () => {
  const { filters } = useFilterStore();
  const { sortOption } = useSortStore();
  // State to store the actual filtered count from AuctionList.tsx
  const [actualFilteredCount, setActualFilteredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Effect to synchronize with the actual filtered count from AuctionList component
  useEffect(() => {
    const checkFilteredCount = () => {
      // Access the value exposed by AuctionList.tsx
      const count = (window as any).filteredItemsCount;
      if (typeof count === 'number') {
        setActualFilteredCount(count);
        setIsLoading(false);
      }
    };
    
    // Check initially and also set an interval to keep checking
    checkFilteredCount();
    const intervalId = setInterval(checkFilteredCount, 500);
    
    return () => clearInterval(intervalId);
  }, []);

  const stats = useMemo(() => {
    const contentType = filters.contentType;
    
    // Use the actual filtered count if available
    if (actualFilteredCount > 0) {
      if (contentType === 'property') {
        // For properties
        const uniqueLocations = new Set(sampleProperties.map(property => property.location));
        const totalSites = uniqueLocations.size;
        // For properties, we'll consider 20% as "new" for demonstration
        const newProperties = Math.round(actualFilteredCount * 0.2);
        
        return {
          totalItems: actualFilteredCount,
          totalSites,
          newItems: newProperties
        };
      } else {
        // For vehicles
        const filteredAuctions = filterAuctions(sampleAuctions, filters);
        const totalSites = calculateTotalSites(filteredAuctions);
        const newAuctions = calculateNewAuctions(filteredAuctions);
        
        return {
          totalItems: actualFilteredCount,
          totalSites,
          newItems: newAuctions
        };
      }
    } else {
      // Fallback to old method if actual count isn't available yet
      if (contentType === 'property') {
        // For properties
        let filteredProperties = [...sampleProperties];
        
        // Apply price filtering
        if (filters.price.range.min) {
          const minPrice = Number(filters.price.range.min);
          filteredProperties = filteredProperties.filter(p => p.currentBid >= minPrice);
        }
        
        if (filters.price.range.max) {
          const maxPrice = Number(filters.price.range.max);
          filteredProperties = filteredProperties.filter(p => p.currentBid <= maxPrice);
        }
        
        const uniqueLocations = new Set(filteredProperties.map(property => property.location));
        const totalSites = uniqueLocations.size;
        const newProperties = calculateNewProperties(filteredProperties);
        
        return {
          totalItems: filteredProperties.length,
          totalSites,
          newItems: newProperties
        };
      } else {
        // For vehicles
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
    }
  }, [filters, actualFilteredCount]);

  // Don't display if there are no items or we're still loading
  if (stats.totalItems === 0 || isLoading) {
    return null;
  }

  // Text varies based on content type
  const itemType = filters.contentType === 'property' ? 'imóveis' : 'leilões';
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: -10
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.3
      }} 
      className="w-fit"
    >
      Encontramos <span className="text-foreground font-medium">{stats.totalItems.toLocaleString('pt-BR')}</span> {itemType} em{' '}
      <span className="text-foreground font-medium">{stats.totalSites.toLocaleString('pt-BR')}</span> sites ·{' '}
      <span className="text-accent2-600 font-medium">{stats.newItems.toLocaleString('pt-BR')}</span> novos hoje
    </motion.div>
  );
};

export default React.memo(AuctionStatus);
