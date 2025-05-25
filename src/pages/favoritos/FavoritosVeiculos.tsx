
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { sampleAuctions } from '@/data/sampleAuctions';
import AuctionCard from '@/components/AuctionCard';
import { AuctionItem } from '@/types/auction';

const FavoritosVeiculos = () => {
  const { favorites, loading } = useFavorites();
  
  // Filter vehicle favorites
  const vehicleFavorites = favorites.filter(fav => fav.item_type === 'vehicle');
  
  // Get the actual auction items from the sample data
  const favoriteVehicles = vehicleFavorites.map(fav => {
    return sampleAuctions.find(auction => auction.id === fav.item_id);
  }).filter(Boolean) as AuctionItem[];

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600 mb-4" />
        <p className="text-gray-500">Carregando seus veículos favoritos...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0">
      <h1 className="text-2xl font-bold mb-6">Meus Veículos Favoritos</h1>
      
      {favoriteVehicles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="h-5 w-5" />
                <span>Nenhum veículo favorito</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Você ainda não adicionou nenhum veículo aos favoritos.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteVehicles.map(vehicle => (
            <AuctionCard key={vehicle.id} auction={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritosVeiculos;
