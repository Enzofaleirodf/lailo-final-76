
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilterStoreSelector } from '@/hooks/useFilterStoreSelector';
import { ContentType } from '@/types/filters';

interface TopFiltersProps {
  contentType: ContentType;
}

/**
 * Componente de tabs para alternar entre diferentes tipos de conteúdo 
 * (imóveis ou veículos)
 */
const TopFilters: React.FC<TopFiltersProps> = ({ contentType }) => {
  const { updateFilter } = useFilterStoreSelector(contentType);

  const handleContentTypeChange = (value: string) => {
    updateFilter('contentType', value as ContentType);
  };

  return (
    <div className="mb-6 flex justify-center">
      <Tabs 
        defaultValue={contentType} 
        onValueChange={handleContentTypeChange} 
        className="w-full max-w-md"
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger 
            value="property"
            data-testid="property-tab"
            aria-label="Filtrar imóveis"
          >
            Imóveis
          </TabsTrigger>
          <TabsTrigger
            value="vehicle" 
            data-testid="vehicle-tab"
            aria-label="Filtrar veículos"
          >
            Veículos
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default React.memo(TopFilters);
