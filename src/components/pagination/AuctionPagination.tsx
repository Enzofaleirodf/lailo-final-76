
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';

interface AuctionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AuctionPagination: React.FC<AuctionPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Renderizar itens de paginação com base no total de páginas e na página atual
  const renderPaginationItems = useCallback(() => {
    const items = [];
    const maxVisible = window.innerWidth < 640 ? 3 : 5; // Menos números no mobile
    
    // Sempre mostrar a primeira página
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => onPageChange(1)}
          className="transition-all duration-200 hover:scale-105"
          aria-label="Ir para a página 1"
          aria-current={currentPage === 1 ? "page" : undefined}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Calcular o intervalo de páginas a serem mostradas
    let startPage = Math.max(2, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 2);
    
    if (endPage - startPage < maxVisible - 2) {
      startPage = Math.max(2, endPage - maxVisible + 2);
    }
    
    // Adicionar reticências após a primeira página, se necessário
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis aria-hidden="true" />
        </PaginationItem>
      );
    }
    
    // Adicionar páginas intermediárias
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => onPageChange(i)}
            className="transition-all duration-200 hover:scale-105"
            aria-label={`Ir para a página ${i}`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Adicionar reticências antes da última página, se necessário
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis aria-hidden="true" />
        </PaginationItem>
      );
    }
    
    // Sempre mostrar a última página se houver mais de uma página
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => onPageChange(totalPages)}
            className="transition-all duration-200 hover:scale-105"
            aria-label={`Ir para a página ${totalPages}`}
            aria-current={currentPage === totalPages ? "page" : undefined}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  }, [currentPage, onPageChange, totalPages]);
  
  // Se não houver mais de uma página, não mostrar paginação
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="py-4"
    >
      <nav aria-label="Navegação de paginação">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className={`${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'hover:scale-105 transition-transform'}`}
                aria-disabled={currentPage <= 1}
                aria-label="Ir para a página anterior"
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className={`${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'hover:scale-105 transition-transform'}`}
                aria-disabled={currentPage >= totalPages}
                aria-label="Ir para a próxima página"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </nav>
    </motion.div>
  );
};

export default React.memo(AuctionPagination);
