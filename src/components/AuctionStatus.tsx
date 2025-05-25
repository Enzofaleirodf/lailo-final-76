import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFilterStore } from '@/stores/useFilterStore';
import { useResultsStore } from '@/stores/useResultsStore';
import { COLORS, TYPOGRAPHY } from '@/constants/designSystem';
import { AuctionItem } from '@/types/auction';

// Helper function to calculate total unique sites from auction items
export const calculateTotalSites = (items: AuctionItem[]): number => {
  const uniqueSites = new Set<string>();
  items.forEach(item => {
    // Some items might have website directly, others might have an href with the site domain
    const site = item.website || (item.href ? new URL(item.href).hostname : '');
    if (site) {
      uniqueSites.add(site);
    }
  });
  return uniqueSites.size;
};

// Helper function to calculate how many auctions are new (from current year)
export const calculateNewAuctions = (items: AuctionItem[]): number => {
  const currentYear = new Date().getFullYear();
  return items.filter(item => {
    // For vehicle auctions, check if the vehicle year matches current year
    return item.vehicleInfo?.year === currentYear;
  }).length;
};
const AuctionStatus: React.FC = () => {
  const {
    filters
  } = useFilterStore();
  const {
    filteredItemsCount,
    totalSites,
    newItems,
    loading
  } = useResultsStore();

  // Show a loading state
  if (loading) {
    return <motion.div 
      initial={{
      opacity: 0
      }}
      animate={{
      opacity: 0.5
      }}
      className={`w-fit ${COLORS.text.gray[400]}`}
    >
        Carregando resultados...
      </motion.div>;
  }

  // Don't display if there are no items
  if (filteredItemsCount === 0) {
    return <motion.div 
      initial={{
      opacity: 0
      }}
      animate={{
      opacity: 1
      }}
      className={`w-fit ${COLORS.text.gray[500]}`}
    >
        Nenhum resultado encontrado para os filtros selecionados
      </motion.div>;
  }

  // Text varies based on content type
  const itemType = filters.contentType === 'property' ? 'imóveis' : 'leilões';
  return <motion.div 
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
      Encontramos <span className={`text-foreground ${TYPOGRAPHY.weight.medium}`}>{filteredItemsCount.toLocaleString('pt-BR')}</span> {itemType} em{' '}
      <span className={`text-foreground ${TYPOGRAPHY.weight.medium}`}>{totalSites.toLocaleString('pt-BR')}</span> sites ·{' '}
      <span className={`${TYPOGRAPHY.weight.medium} ${COLORS.text.accent2[600]}`}>{newItems.toLocaleString('pt-BR')}</span> novos hoje
    </motion.div>;
};
export default React.memo(AuctionStatus);