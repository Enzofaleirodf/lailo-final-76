
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LightLogin } from '@/components/ui/sign-in';
import { useAuth } from '@/hooks/useAuth';

interface UserAvatarProps {
  className?: string;
  mobile?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ className, mobile = false }) => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  
  // Função para lidar com o clique no avatar
  const handleAvatarClick = () => {
    if (isAuthenticated) {
      navigate('/perfil');
    } else {
      setOpenDialog(true);
    }
  };

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

      {/* Dialog para login/cadastro usando o novo componente LightLogin */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="p-0 border-none max-w-md">
          <LightLogin />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserAvatar;
