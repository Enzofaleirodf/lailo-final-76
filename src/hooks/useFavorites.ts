import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface FavoriteItem {
  id: string;
  item_id: string;
  item_type: 'property' | 'vehicle';
  created_at: string;
}

export const useFavorites = () => {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        
        // Mock data for development
        const mockFavorites: FavoriteItem[] = [
          {
            id: '1',
            item_id: '1',
            item_type: 'vehicle',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            item_id: '2',
            item_type: 'vehicle',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            item_id: 'prop-001',
            item_type: 'property',
            created_at: new Date().toISOString()
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setFavorites(mockFavorites);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      } finally {
        // Loading is set to false in the setTimeout or catch block
      }
    };

    fetchFavorites();
  }, [isAuthenticated, user]);

  // Add a favorite
  const addFavorite = async (itemId: string, itemType: 'property' | 'vehicle') => {
    if (!isAuthenticated || !user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      console.log('Adding favorite:', { itemId, itemType });
      
      // Mock adding a favorite
      const newFavorite: FavoriteItem = {
        id: Math.random().toString(),
        item_id: itemId,
        item_type: itemType,
        created_at: new Date().toISOString()
      };
      
      setFavorites([...favorites, newFavorite]);
      return { success: true, error: null };
    } catch (error) {
      console.error('Error adding favorite:', error);
      return { success: false, error: error as Error };
    }
  };

  // Remove a favorite
  const removeFavorite = async (itemId: string) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      console.log('Removing favorite:', itemId);
      
      // Mock removing a favorite
      setFavorites(favorites.filter(fav => fav.item_id !== itemId));
      return { success: true, error: null };
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { success: false, error: error as Error };
    }
  };

  // Check if an item is favorited
  const isFavorite = (itemId: string) => {
    return favorites.some(fav => fav.item_id === itemId);
  };

  // Toggle favorite status
  const toggleFavorite = async (itemId: string, itemType: 'property' | 'vehicle') => {
    if (isFavorite(itemId)) {
      return removeFavorite(itemId);
    } else {
      return addFavorite(itemId, itemType);
    }
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};