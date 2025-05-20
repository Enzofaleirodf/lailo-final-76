
import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateMessageProps {
  contentType: 'property' | 'vehicle';
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ contentType }) => {
  const contentTypeLabel = contentType === 'property' ? 'imóveis' : 'leilões';
  
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
};

export default EmptyStateMessage;
