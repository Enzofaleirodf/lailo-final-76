
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LightLogin } from '@/components/ui/sign-in';
import { useAuth } from '@/hooks/useAuth';

interface FavoriteButtonProps {
  itemId: string;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string, isFavorited: boolean) => void;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  isFavorited = false,
  onToggleFavorite,
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (onToggleFavorite) {
      onToggleFavorite(itemId, !isFavorited);
    }
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`p-0 hover:bg-gray-100 ${className}`}
        onClick={handleClick}
        aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart 
          className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
        />
      </Button>
      
      {/* Modal de Login */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="p-0 border-none max-w-md">
          <LightLogin />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FavoriteButton;
