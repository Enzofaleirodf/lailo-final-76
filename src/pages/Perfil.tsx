import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { LightLogin } from '@/components/ui/sign-in';

const Perfil = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Show login form if not authenticated
  if (!isAuthenticated || !user) {
    // Usando o LightLogin sem o botão de fechar (isInDialog=false e hideCloseButton=true)
    return <LightLogin isInDialog={false} hideCloseButton={true} />;
  }
  
  return (
    <div className="px-4 md:px-0">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm col-span-1">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.photoUrl} alt={user?.name} />
                <AvatarFallback className="text-3xl bg-brand-600 text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user?.name}</CardTitle>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button variant="outline" className="w-full" onClick={() => navigate('/perfil/editar')}>
              Editar Perfil
            </Button>
            <Button variant="outline" className="w-full" onClick={signOut}>
              Sair
            </Button>
          </CardContent>
        </Card>
        
        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Meus Favoritos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Visualize seus itens favoritados.
                </p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto mt-2" 
                  onClick={() => navigate('/favoritos')}
                >
                  Ver todos os favoritos
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Alertas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Configure alertas para novos leilões.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Gerencie suas preferências e configurações.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;