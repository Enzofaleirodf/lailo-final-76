
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualizedFilterListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  overscan?: number;
  className?: string;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

/**
 * Componente otimizado para renderizar listas longas de filtros
 * usando virtualização para melhorar o desempenho
 */
function VirtualizedFilterList<T>({
  items,
  renderItem,
  itemHeight = 40,
  overscan = 5,
  className = '',
  onEndReached,
  endReachedThreshold = 0.8
}: VirtualizedFilterListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  
  // Criar virtualizador para lidar com a renderização eficiente
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });
  
  // Tamanho total da lista virtual
  const totalHeight = virtualizer.getTotalSize();
  
  // Verificar se chegou ao final da lista para carregar mais itens se necessário
  const checkEndReached = useCallback(() => {
    if (!parentRef.current || !onEndReached || hasReachedEnd) return;
    
    const { scrollTop, clientHeight, scrollHeight } = parentRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage >= endReachedThreshold && !hasReachedEnd) {
      setHasReachedEnd(true);
      onEndReached();
    }
  }, [onEndReached, hasReachedEnd, endReachedThreshold]);
  
  // Resetar o estado quando os itens mudarem
  useEffect(() => {
    setHasReachedEnd(false);
  }, [items]);
  
  // Adicionar manipulador de rolagem
  useEffect(() => {
    const element = parentRef.current;
    if (!element) return;
    
    element.addEventListener('scroll', checkEndReached);
    return () => {
      element.removeEventListener('scroll', checkEndReached);
    };
  }, [checkEndReached]);
  
  // Gerar itens virtualizados
  const virtualItems = virtualizer.getVirtualItems();
  
  return (
    <div 
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height: '100%', maxHeight: '500px' }}
      role="list"
      aria-label="Lista de opções de filtro virtualizada"
    >
      <div 
        style={{ 
          height: `${totalHeight}px`, 
          width: '100%', 
          position: 'relative' 
        }}
      >
        {virtualItems.map(virtualItem => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={(el) => virtualizer.measureElement(el)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
            role="listitem"
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualizedFilterList;
