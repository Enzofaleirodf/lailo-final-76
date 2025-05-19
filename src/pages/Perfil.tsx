
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const navigate = useNavigate();
  // Simulação de usuário não autenticado
  const isAuthenticated = false;
  
  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="px-4 md:px-0">
          <h1 className="text-2xl font-bold mb-6">Perfil</h1>
          
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                Faça login ou crie uma conta para acessar seu perfil.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/auth/login')}>
                  Login
                </Button>
                <Button variant="outline" onClick={() => navigate('/auth/sign-up')}>
                  Criar Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="px-4 md:px-0">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Detalhes do perfil estarão disponíveis após a autenticação.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Preferências</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Preferências estarão disponíveis após a autenticação.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Perfil;
