
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { sampleProperties } from '@/data/sampleProperties';
import PropertyCard from '@/components/PropertyCard';
import { PropertyItem } from '@/types/property';

const FavoritosImoveis = () => {
  const { favorites, loading } = useFavorites();
  
  // Filter property favorites
  const propertyFavorites = favorites.filter(fav => fav.item_type === 'property');
  
  // Get the actual property items from the sample data
  const favoriteProperties = propertyFavorites.map(fav => {
    return sampleProperties.find(property => property.id === fav.item_id);
  }).filter(Boolean) as PropertyItem[];

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600 mb-4" />
        <p className="text-gray-500">Carregando seus imóveis favoritos...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0">
      <h1 className="text-2xl font-bold mb-6">Meus Imóveis Favoritos</h1>
      
      {favoriteProperties.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span>Nenhum imóvel favorito</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Você ainda não adicionou nenhum imóvel aos favoritos.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritosImoveis;
