import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Car, Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { sampleProperties } from '@/data/sampleProperties';
import { sampleAuctions } from '@/data/sampleAuctions';
import PropertyCard from '@/components/PropertyCard';
import AuctionCard from '@/components/AuctionCard';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';
import { Helmet } from 'react-helmet-async';
import ErrorBoundary from '@/components/ErrorBoundary';

interface FavoritosPageProps {
  contentType: 'property' | 'vehicle';
}

/**
 * Shared component for displaying favorites
 * Can be used for both property and vehicle favorites
 */
const FavoritosPage: React.FC<FavoritosPageProps> = ({ contentType }) => {
  const { favorites, loading } = useFavorites();
  
  // Filter favorites by content type
  const filteredFavorites = favorites.filter(fav => fav.item_type === contentType);
  
  // Get the actual items from the sample data
  const favoriteItems = filteredFavorites.map(fav => {
    if (contentType === 'property') {
      return sampleProperties.find(property => property.id === fav.item_id);
    } else {
      return sampleAuctions.find(auction => auction.id === fav.item_id);
    }
  }).filter(Boolean) as (AuctionItem | PropertyItem)[];

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600 mb-4" />
        <p className="text-gray-500">
          Carregando seus {contentType === 'property' ? 'imóveis' : 'veículos'} favoritos...
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary componentName={`Favoritos${contentType === 'property' ? 'Imoveis' : 'Veiculos'}`}>
      <Helmet>
        <title>
          {contentType === 'property' ? 'Imóveis Favoritos' : 'Veículos Favoritos'} | Lailo
        </title>
        <meta 
          name="description" 
          content={`Seus ${contentType === 'property' ? 'imóveis' : 'veículos'} favoritos na Lailo`} 
        />
      </Helmet>
      
      <div className="px-4 md:px-0">
        <h1 className="text-2xl font-bold mb-6">
          Meus {contentType === 'property' ? 'Imóveis' : 'Veículos'} Favoritos
        </h1>
        
        {favoriteItems.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {contentType === 'property' ? (
                    <Building2 className="h-5 w-5" />
                  ) : (
                    <Car className="h-5 w-5" />
                  )}
                  <span>
                    Nenhum {contentType === 'property' ? 'imóvel' : 'veículo'} favorito
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Você ainda não adicionou nenhum {contentType === 'property' ? 'imóvel' : 'veículo'} aos favoritos.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteItems.map(item => (
              <ErrorBoundary key={item.id} componentName={`FavoriteItem-${item.id}`}>
                {contentType === 'property' ? (
                  <PropertyCard property={item as PropertyItem} />
                ) : (
                  <AuctionCard auction={item as AuctionItem} />
                )}
              </ErrorBoundary>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default FavoritosPage;