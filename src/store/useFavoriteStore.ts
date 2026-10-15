import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * FavoritesStorage model untuk localStorage persistence
 * Includes versioning untuk future migrations
 */
interface FavoritesStorage {
  version: number; // untuk migration jika structure berubah
  favorites: string[]; // property IDs
  lastUpdated: string; // ISO date
}

/**
 * State interface untuk Favorite Store
 */
interface FavoriteState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  favoriteCount: number;
}

const STORAGE_KEY = 'favorites-storage';
const STORAGE_VERSION = 1;

/**
 * Zustand store untuk mengelola favorites/wishlist
 * 
 * Features:
 * - Persist ke localStorage dengan versioning
 * - Toggle favorite (add/remove property ID)
 * - Check if property is favorited
 * - Clear all favorites
 * - Computed favoriteCount
 * 
 * Requirements: 11.2, 11.3, 11.6
 */
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      favoriteCount: 0,

      /**
       * Toggle favorite status untuk property ID
       * Jika ID sudah ada, remove dari favorites
       * Jika ID belum ada, add ke favorites
       * 
       * Requirement 11.2: Menyimpan properti ke wishlist
       */
      toggleFavorite: (id: string) => {
        set((state) => {
          const exists = state.favorites.includes(id);
          const newFavorites = exists
            ? state.favorites.filter((favId) => favId !== id)
            : [...state.favorites, id];

          return {
            favorites: newFavorites,
            favoriteCount: newFavorites.length,
          };
        });
      },

      /**
       * Check apakah property ID ada di favorites
       * 
       * Requirement 11.3: Menampilkan status favorit
       */
      isFavorite: (id: string) => {
        return get().favorites.includes(id);
      },

      /**
       * Clear semua favorites
       * 
       * Requirement 11.6: Mempertahankan daftar favorit
       */
      clearFavorites: () => {
        set({
          favorites: [],
          favoriteCount: 0,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      
      /**
       * Custom storage implementation dengan versioning
       * Menyimpan dalam format FavoritesStorage
       */
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          try {
            const stored: FavoritesStorage = JSON.parse(str);
            
            // Version check - jika version berbeda, bisa implement migration logic
            if (stored.version !== STORAGE_VERSION) {
              console.warn(
                `Storage version mismatch. Expected ${STORAGE_VERSION}, got ${stored.version}`
              );
              // Untuk sekarang, return null untuk reset storage
              // Di masa depan, bisa implement migration logic di sini
              return null;
            }

            // Return state dalam format yang diharapkan Zustand
            return {
              state: {
                favorites: stored.favorites,
                favoriteCount: stored.favorites.length,
              },
            };
          } catch (error) {
            console.error('Error parsing favorites from localStorage:', error);
            return null;
          }
        },

        setItem: (name, value) => {
          try {
            const state = value.state as Pick<FavoriteState, 'favorites'>;
            
            const storage: FavoritesStorage = {
              version: STORAGE_VERSION,
              favorites: state.favorites,
              lastUpdated: new Date().toISOString(),
            };

            localStorage.setItem(name, JSON.stringify(storage));
          } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
          }
        },

        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
