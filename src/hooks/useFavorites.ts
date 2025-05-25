import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { handleError } from '@/utils/errorUtils';
import { logUserAction } from '@/utils/loggingUtils';

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
        
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        setFavorites(data || []);
      } catch (error) {
        handleError(error, 'useFavorites.fetchFavorites');
      } finally {
        setLoading(false);
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
      logUserAction('add_favorite', { itemId, itemType });
      
      const { data, error } = await supabase
        .from('favorites')
        .insert([
          {
            user_id: user.id,
            item_id: itemId,
            item_type: itemType,
          },
        ])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setFavorites([...favorites, data]);
      return { success: true, error: null };
    } catch (error) {
      handleError(error, 'useFavorites.addFavorite');
      return { success: false, error: error as Error };
    }
  };

  // Remove a favorite
  const removeFavorite = async (itemId: string) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      logUserAction('remove_favorite', { itemId });
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId);
        
      if (error) {
        throw error;
      }
      
      setFavorites(favorites.filter(fav => fav.item_id !== itemId));
      return { success: true, error: null };
    } catch (error) {
      handleError(error, 'useFavorites.removeFavorite');
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