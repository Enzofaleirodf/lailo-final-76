
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

const FavoritosImoveis = () => {
  return (
    <div className="px-4 md:px-0">
      <h1 className="text-2xl font-bold mb-6">Meus Imóveis Favoritos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span>Favoritos de Imóveis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Seus imóveis favoritos aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FavoritosImoveis;
