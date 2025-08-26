import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (thinkerName: string) => void;
  isFavorite: (thinkerName: string) => boolean;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('organ-framework-favorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } catch (error) {
        console.warn('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('organ-framework-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (thinkerName: string) => {
    setFavorites(prev => {
      if (prev.includes(thinkerName)) {
        return prev.filter(name => name !== thinkerName);
      } else {
        return [...prev, thinkerName];
      }
    });
  };

  const isFavorite = (thinkerName: string) => {
    return favorites.includes(thinkerName);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      showFavoritesOnly,
      setShowFavoritesOnly
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};