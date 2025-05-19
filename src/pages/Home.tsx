
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-brand-900">Leilões Brasil</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Centralizando todos os leilões oficiais do Brasil em uma única plataforma.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Imóveis em Leilão</CardTitle>
              <CardDescription>Encontre casas, apartamentos, terrenos e muito mais</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acesse oportunidades em leilões de imóveis de todo o Brasil com filtros avançados.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/buscador/imoveis')} className="w-full">
                Ver Imóveis
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Veículos em Leilão</CardTitle>
              <CardDescription>Carros, motos, caminhões e outros veículos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Encontre veículos em leilão com preços abaixo do mercado e filtros específicos.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/buscador/veiculos')} className="w-full">
                Ver Veículos
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
