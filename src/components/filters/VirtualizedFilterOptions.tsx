
import React, { useState, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import VirtualizedFilterList from './optimized/VirtualizedFilterList';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface FilterItem {
  id: string;
  label: string;
  count?: number;
}

interface VirtualizedFilterOptionsProps {
  items: FilterItem[];
  selectedItems: string[];
  onChange: (selectedItems: string[]) => void;
  title: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  className?: string;
  allowSearch?: boolean;
  itemHeight?: number;
}

/**
 * Componente otimizado para renderizar e selecionar listas longas de filtros
 * Usa virtualização para melhor desempenho e inclui pesquisa
 */
const VirtualizedFilterOptions: React.FC<VirtualizedFilterOptionsProps> = ({
  items,
  selectedItems,
  onChange,
  title,
  emptyMessage = "Nenhuma opção disponível",
  searchPlaceholder = "Pesquisar...",
  className = "",
  allowSearch = true,
  itemHeight = 36,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtra itens com base no termo de pesquisa
  const filteredItems = React.useMemo(() => {
    if (!searchTerm) return items;
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return items.filter(item => 
      item.label.toLowerCase().includes(normalizedSearch)
    );
  }, [items, searchTerm]);
  
  // Manipular mudança de seleção
  const handleItemChange = useCallback((itemId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedItems, itemId]);
      
      // Anunciar para leitores de tela
      announceSelectionChange(items.find(i => i.id === itemId)?.label || '', true);
    } else {
      onChange(selectedItems.filter(id => id !== itemId));
      
      // Anunciar para leitores de tela
      announceSelectionChange(items.find(i => i.id === itemId)?.label || '', false);
    }
  }, [selectedItems, onChange, items]);
  
  // Manipular pesquisa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    // Simular carregamento para experiência de usuário melhor
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
    
    // Anunciar para leitores de tela quando a pesquisa alterar resultados
    setTimeout(() => {
      announceSearchResults(filteredItems.length);
    }, 500);
  };
  
  // Renderizar item individual
  const renderItem = useCallback((item: FilterItem) => {
    const isSelected = selectedItems.includes(item.id);
    const itemId = `filter-option-${item.id}`;
    
    return (
      <div className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-50 rounded">
        <Checkbox
          id={itemId}
          checked={isSelected}
          onCheckedChange={(checked) => handleItemChange(item.id, checked === true)}
          aria-checked={isSelected}
          className="data-[state=checked]:bg-brand-600 data-[state=checked]:border-brand-600"
        />
        <Label
          htmlFor={itemId}
          className="text-sm cursor-pointer flex justify-between w-full"
        >
          <span>{item.label}</span>
          {item.count !== undefined && (
            <span className="text-xs text-gray-500 ml-2">({item.count})</span>
          )}
        </Label>
      </div>
    );
  }, [selectedItems, handleItemChange]);
  
  // Anunciar mudanças para leitores de tela
  const announceSelectionChange = (label: string, isSelected: boolean) => {
    const message = isSelected 
      ? `${label} selecionado` 
      : `${label} desmarcado`;
    updateLiveRegion(message);
  };
  
  const announceSearchResults = (count: number) => {
    const message = count === 0 
      ? `Nenhum resultado encontrado para ${searchTerm}` 
      : `${count} ${count === 1 ? 'resultado encontrado' : 'resultados encontrados'} para ${searchTerm}`;
    updateLiveRegion(message);
  };
  
  const updateLiveRegion = (message: string) => {
    const liveRegion = document.getElementById('virtualized-filter-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  };
  
  // Criar região ao vivo para anúncios de leitores de tela
  React.useEffect(() => {
    let announcer = document.getElementById('virtualized-filter-live-region');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'virtualized-filter-live-region';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    
    return () => {
      if (announcer && announcer.parentNode) {
        announcer.parentNode.removeChild(announcer);
      }
    };
  }, []);

  return (
    <div 
      className={cn("filter-options-container", className)} 
      role="region"
      aria-labelledby="filter-options-heading"
    >
      <h3 id="filter-options-heading" className="text-sm font-medium mb-2">{title}</h3>
      
      {/* Barra de pesquisa */}
      {allowSearch && (
        <div className="relative mb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-8 pr-3 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            aria-label="Pesquisar opções"
          />
          <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        </div>
      )}
      
      {/* Lista virtualizada de opções */}
      <div 
        className="mt-2 border border-gray-200 rounded bg-white" 
        style={{ height: '220px' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            Carregando...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-500" role="status">
            {emptyMessage}
          </div>
        ) : (
          <VirtualizedFilterList
            items={filteredItems}
            renderItem={renderItem}
            itemHeight={itemHeight}
            className="p-1"
            onEndReached={() => console.log('End reached')}
          />
        )}
      </div>
      
      {/* Status da seleção para feedback do usuário */}
      <div className="mt-1 text-xs text-right text-gray-500">
        {selectedItems.length > 0 ? (
          <span>{selectedItems.length} {selectedItems.length === 1 ? 'selecionado' : 'selecionados'}</span>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(VirtualizedFilterOptions);
