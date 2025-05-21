
import React from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle } from 'lucide-react';
import { useFilterStore } from '@/stores/useFilterStore';

interface EmptyStateMessageProps {
  contentType: 'property' | 'vehicle';
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  contentType
}) => {
  const {
    activeFilters,
    resetFilters
  } = useFilterStore();
  
  const contentTypeLabel = contentType === 'property' ? 'imóveis' : 'leilões';
  
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: 20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-brand-50">
        {activeFilters > 0 ? (
          <Search aria-hidden="true" className="w-8 h-8 text-brand-500 bg-transparent" />
        ) : (
          <AlertCircle className="w-8 h-8 text-purple-600" aria-hidden="true" />
        )}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        Nenhum {contentTypeLabel} encontrado
      </h3>
      
      <p className="text-gray-500 mb-4">
        {activeFilters > 0 
          ? `Tente ajustar os filtros aplicados para ampliar sua busca.`
          : `Não encontramos ${contentTypeLabel} disponíveis no momento.`
        }
      </p>
      
      {activeFilters > 0 && (
        <motion.button
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={resetFilters}
          className="px-4 py-2 text-white rounded-md transition-colors bg-brand-500 hover:bg-brand-400"
        >
          Limpar todos os filtros
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyStateMessage;
