
import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
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
  const itemsLength = items.length;
  
  // Memoize the virtualizer to prevent unnecessary re-creations
  const virtualizer = useVirtualizer({
    count: itemsLength,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });
  
  // Tamanho total da lista virtual - memoized
  const totalHeight = useMemo(() => virtualizer.getTotalSize(), [virtualizer]);
  
  // Verificar se chegou ao final da lista para carregar mais itens se necessário
  const checkEndReached = useCallback(() => {
    if (!parentRef.current || !onEndReached || hasReachedEnd) return;
    
    const { scrollTop, clientHeight, scrollHeight } = parentRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage >= endReachedThreshold && !hasReachedEnd) {
      setHasReachedEnd(true);
      onEndReached();
      
      // Anunciar para leitores de tela
      const liveRegion = document.getElementById('virtualized-list-announcer');
      if (liveRegion) {
        liveRegion.textContent = 'Carregando mais itens';
      }
    }
  }, [onEndReached, hasReachedEnd, endReachedThreshold]);
  
  // Resetar o estado quando os itens mudarem
  useEffect(() => {
    setHasReachedEnd(false);
    
    // Anunciar mudanças para leitores de tela
    const count = items.length;
    const liveRegion = document.getElementById('virtualized-list-announcer');
    if (liveRegion && count > 0) {
      liveRegion.textContent = `Lista carregada com ${count} itens`;
    }
  }, [items]);
  
  // Create announcer for screen readers
  useEffect(() => {
    let announcer = document.getElementById('virtualized-list-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'virtualized-list-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      announcer.style.clip = 'rect(0, 0, 0, 0)';
      document.body.appendChild(announcer);
    }
    
    return () => {
      if (announcer && announcer.parentNode) {
        announcer.parentNode.removeChild(announcer);
      }
    };
  }, []);
  
  // Adicionar manipulador de rolagem
  useEffect(() => {
    const element = parentRef.current;
    if (!element) return;
    
    const handleScroll = () => {
      requestAnimationFrame(checkEndReached);
    };
    
    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [checkEndReached]);
  
  // Gerar itens virtualizados - memoized
  const virtualItems = useMemo(() => virtualizer.getVirtualItems(), [virtualizer]);
  
  // Memoize rendered items for better performance
  const renderedItems = useMemo(() => {
    return virtualItems.map(virtualItem => (
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
    ));
  }, [virtualItems, renderItem, items, virtualizer]);
  
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
        {renderedItems}
      </div>
    </div>
  );
}

export default React.memo(VirtualizedFilterList);
