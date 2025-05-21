import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Car } from 'lucide-react';
const Home = () => {
  return <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
      
      <p className="text-lg text-gray-600 mb-8 max-w-lg">
        Encontre as melhores oportunidades em leilões de imóveis e veículos.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link to="/buscador/imoveis" className="w-full">
          <Button variant="default" className="w-full p-8 flex flex-col h-auto gap-4" size="lg">
            <Building2 className="h-12 w-12" />
            <span className="text-xl">Leilões de Imóveis</span>
          </Button>
        </Link>
        
        <Link to="/buscador/veiculos" className="w-full">
          <Button variant="default" className="w-full p-8 flex flex-col h-auto gap-4" size="lg">
            <Car className="h-12 w-12" />
            <span className="text-xl">Leilões de Veículos</span>
          </Button>
        </Link>
      </div>
    </div>;
};
export default Home;