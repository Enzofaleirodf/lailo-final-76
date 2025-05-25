
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LightLogin } from '@/components/ui/sign-in';
import { COLORS } from '@/constants/designSystem';
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
        className={`h-6 w-6 min-h-0 min-w-0 p-0 hover:bg-transparent ${className}`} 
        onClick={handleClick}
        aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart 
          className={`h-5 w-5 ${isFavorited ? `fill-red-500 ${COLORS.text.error}` : COLORS.text.gray[500]}`} 
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
