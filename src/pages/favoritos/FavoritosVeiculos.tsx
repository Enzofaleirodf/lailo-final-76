
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';

const FavoritosVeiculos = () => {
  return (
    <div className="px-4 md:px-0">
      <h1 className="text-2xl font-bold mb-6">Meus Veículos Favoritos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="h-5 w-5" />
              <span>Favoritos de Veículos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Seus veículos favoritos aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FavoritosVeiculos;
