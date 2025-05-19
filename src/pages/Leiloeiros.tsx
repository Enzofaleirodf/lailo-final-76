
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Leiloeiros = () => {
  return (
    <AppLayout>
      <div className="px-4 md:px-0">
        <h1 className="text-2xl font-bold mb-6">Leiloeiros Oficiais</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Em Construção</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Lista de leiloeiros oficiais estará disponível em breve.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Leiloeiros;
