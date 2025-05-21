
/**
 * @fileoverview Hook personalizado para gerenciar a paginação
 */
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UsePaginationProps {
  totalPages: number;
}

/**
 * Hook para gerenciar lógica de paginação
 */
export const usePagination = ({ totalPages }: UsePaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  // Navegar para uma página específica
  const navigateToPage = useCallback((page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNumber.toString());
    setSearchParams(newParams);
  }, [searchParams, setSearchParams, totalPages]);
  
  // Navegar para a próxima página
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      navigateToPage(currentPage + 1);
    }
  }, [currentPage, navigateToPage, totalPages]);
  
  // Navegar para a página anterior
  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      navigateToPage(currentPage - 1);
    }
  }, [currentPage, navigateToPage]);
  
  // Verificar se a página atual é válida
  const isValidPage = currentPage <= totalPages && currentPage > 0;
  
  return {
    currentPage,
    totalPages,
    navigateToPage,
    nextPage,
    previousPage,
    isValidPage
  };
};
