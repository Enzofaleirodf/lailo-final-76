
import React, { useRef, useEffect, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFilterStore } from '@/stores/useFilterStore';

interface FilterWrapperProps {
  children: ReactNode;
}

/**
 * A wrapper component for filter elements that prevents scroll jumps
 * by capturing events and selectively handling them based on context
 */
const FilterWrapper: React.FC<FilterWrapperProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { filters } = useFilterStore();
  const scrollPositionRef = useRef(0);
  
  // For desktop, implement automatic filter application
  useEffect(() => {
    if (!isMobile) {
      // Armazenar a posição de rolagem antes de enviar o evento
      scrollPositionRef.current = window.scrollY;
      
      // Criar e despachar o evento filters:applied com a posição de rolagem atual
      const event = new CustomEvent('filters:applied', {
        detail: { 
          scrollPosition: scrollPositionRef.current,
          timestamp: Date.now() // Adicionar timestamp para tornar cada evento único
        }
      });
      
      // Adicionar um atraso pequeno para garantir que a rolagem seja capturada corretamente
      setTimeout(() => {
        window.dispatchEvent(event);
      }, 10);
    }
  }, [filters, isMobile]);
  
  // Event handling logic - prevents URL jumps but allows filter interactions
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    
    const handleInteraction = (e: Event) => {
      // Only modify navigation-related events
      // Allow filter interactions to work normally
      if (e.target && 
          ((e.target as HTMLElement).closest('a') || 
           (e.target as HTMLElement).hasAttribute('href'))) {
        
        // Prevent navigation while allowing filter functionality
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    // Only capture link-related events
    const eventTypes = ['click'];
    
    // Use capture phase to intercept events before they reach React's event system
    eventTypes.forEach(eventType => {
      wrapper.addEventListener(eventType, handleInteraction, { capture: true });
    });
    
    return () => {
      eventTypes.forEach(eventType => {
        wrapper.removeEventListener(eventType, handleInteraction, { capture: true });
      });
    };
  }, []);
  
  return (
    <div 
      ref={wrapperRef} 
      className="filter-wrapper"
      data-filter-interaction-zone="true"
    >
      {children}
    </div>
  );
};

export default React.memo(FilterWrapper);
