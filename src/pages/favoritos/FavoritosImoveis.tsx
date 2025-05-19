
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FavoritosImoveis = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Aqui será implementado posteriormente a lógica para buscar os favoritos do usuário
  
  return (
    <AppLayout>
      <div className="px-4 md:px-0">
        <h1 className="text-2xl font-bold mb-6">Imóveis Favoritos</h1>
        
        <div className="flex mb-4 border-b">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/favoritos/imoveis')}
            className="border-b-2 border-brand-600 text-brand-900 font-medium"
          >
            Imóveis
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/favoritos/veiculos')}
            className="text-gray-500"
          >
            Veículos
          </Button>
        </div>
        
        <div className="mt-6">
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">Você ainda não tem imóveis favoritos.</p>
              <Button onClick={() => navigate('/buscador/imoveis')}>
                Encontrar Imóveis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default FavoritosImoveis;
