
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { COLORS } from '@/constants/designSystem';
import { LightLogin } from '@/components/ui/sign-in';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  itemId: string;
  itemType?: 'property' | 'vehicle';
  isFavorited?: boolean;
  onToggleFavorite?: (id: string, isFavorited: boolean) => void;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  itemType = 'vehicle',
  isFavorited = false,
  onToggleFavorite,
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [localFavorited, setLocalFavorited] = useState(isFavorited);
  
  // Update local state when favorites change
  useEffect(() => {
    if (isAuthenticated) {
      setLocalFavorited(isFavorite(itemId));
    } else {
      setLocalFavorited(isFavorited);
    }
  }, [isAuthenticated, isFavorite, itemId, isFavorited]);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    // Toggle favorite in database
    toggleFavorite(itemId, itemType).then(({ success }) => {
      if (success) {
        // Update local state
        setLocalFavorited(!localFavorited);
        
        // Call the callback if provided
        if (onToggleFavorite) {
          onToggleFavorite(itemId, !localFavorited);
        }
      }
    });
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
          className={`h-5 w-5 ${localFavorited ? `fill-red-500 ${COLORS.text.error}` : COLORS.text.gray[500]}`} 
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
