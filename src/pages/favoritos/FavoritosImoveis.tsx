
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LightLogin } from '@/components/ui/sign-in';

// Simulação do estado de autenticação - substituir pela sua lógica real de autenticação
const useAuth = () => {
  // Mockup simples para demonstração
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{name: string; email: string; photoUrl?: string} | null>(null);
  
  const login = () => {
    setIsAuthenticated(true);
    setUser({ name: 'Usuário Teste', email: 'usuario@teste.com' });
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };
  
  return { isAuthenticated, user, login, logout };
};

const FavoritosImoveis = () => {
  const { isAuthenticated } = useAuth();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  
  // Verificar autenticação quando o componente for montado
  useEffect(() => {
    if (!isAuthenticated) {
      setOpenLoginDialog(true);
    }
  }, [isAuthenticated]);

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

      {/* Modal de Login para usuários não autenticados */}
      <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
        <DialogContent className="p-0 border-none max-w-md">
          <LightLogin />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FavoritosImoveis;
