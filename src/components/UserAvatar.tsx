
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UserAvatarProps {
  className?: string;
  mobile?: boolean;
}

// Simulação do estado de autenticação - substituir pela sua lógica real de autenticação
const useAuth = () => {
  // Mockup simples para demonstração
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{name: string; email: string; photoUrl?: string} | null>(null);
  
  const login = () => {
    // Mockup para demonstração - substituir com sua lógica real de login
    setIsAuthenticated(true);
    setUser({ name: 'Usuário Teste', email: 'usuario@teste.com' });
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };
  
  return { isAuthenticated, user, login, logout };
};

const UserAvatar: React.FC<UserAvatarProps> = ({ className, mobile = false }) => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  
  // Função para lidar com o clique no avatar
  const handleAvatarClick = () => {
    if (isAuthenticated) {
      navigate('/perfil');
    } else {
      // Apenas abra o modal de login quando não autenticado, não navega mais
      setOpenDialog(true);
    }
  };

  // Componente de login para o Dialog
  const LoginForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email-login" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email-login"
          type="email"
          className="w-full p-2 border rounded-md"
          placeholder="seu@email.com"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password-login" className="text-sm font-medium">
            Senha
          </label>
          <Button variant="link" className="text-xs p-0 h-auto">
            Esqueceu a senha?
          </Button>
        </div>
        <input
          id="password-login"
          type="password"
          className="w-full p-2 border rounded-md"
        />
      </div>
      <Button
        onClick={() => {
          login();
          setOpenDialog(false);
        }}
        className="w-full"
      >
        Entrar
      </Button>
    </div>
  );

  // Componente de cadastro para o Dialog
  const SignUpForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name-signup" className="text-sm font-medium">
          Nome
        </label>
        <input
          id="name-signup"
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Seu nome completo"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email-signup" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email-signup"
          type="email"
          className="w-full p-2 border rounded-md"
          placeholder="seu@email.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password-signup" className="text-sm font-medium">
          Senha
        </label>
        <input
          id="password-signup"
          type="password"
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm-password-signup" className="text-sm font-medium">
          Confirmar Senha
        </label>
        <input
          id="confirm-password-signup"
          type="password"
          className="w-full p-2 border rounded-md"
        />
      </div>
      <Button
        onClick={() => {
          login();
          setOpenDialog(false);
        }}
        className="w-full"
      >
        Criar Conta
      </Button>
    </div>
  );

  return (
    <>
      {/* Avatar ou ícone do usuário, dependendo do estado de autenticação */}
      <button
        onClick={handleAvatarClick}
        className={`flex items-center justify-center ${className}`}
        aria-label={isAuthenticated ? 'Ver perfil' : 'Login ou cadastro'}
      >
        {isAuthenticated ? (
          <Avatar className={mobile ? 'h-5 w-5' : 'h-8 w-8'}>
            <AvatarImage src={user?.photoUrl} alt={user?.name} />
            <AvatarFallback className="bg-brand-600 text-white">
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User className={`${mobile ? 'h-5 w-5' : 'h-6 w-6'} ${mobile ? 'text-gray-500' : 'text-brand-200'}`} />
        )}
      </button>

      {/* Dialog para login/cadastro */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Acesse sua conta</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserAvatar;
