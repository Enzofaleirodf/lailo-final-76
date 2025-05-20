
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFilterStore } from '@/stores/useFilterStore';
import { useResultsStore } from '@/stores/useResultsStore';

const AuctionStatus: React.FC = () => {
  const { filters } = useFilterStore();
  const { 
    filteredItemsCount, 
    totalSites, 
    newItems, 
    loading 
  } = useResultsStore();
  
  // Show a loading state
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="w-fit text-gray-400"
      >
        Carregando resultados...
      </motion.div>
    );
  }

  // Don't display if there are no items
  if (filteredItemsCount === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-fit text-gray-500"
      >
        Nenhum resultado encontrado para os filtros selecionados
      </motion.div>
    );
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
      Encontramos <span className="text-foreground font-medium">{filteredItemsCount.toLocaleString('pt-BR')}</span> {itemType} em{' '}
      <span className="text-foreground font-medium">{totalSites.toLocaleString('pt-BR')}</span> sites ·{' '}
      <span className="text-accent2-600 font-medium">{newItems.toLocaleString('pt-BR')}</span> novos hoje
    </motion.div>
  );
};

export default React.memo(AuctionStatus);
