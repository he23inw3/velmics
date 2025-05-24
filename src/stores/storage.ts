import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { HistoryItem, UserPreferences } from '@/types/manga';

export const useStorageStore = defineStore('storage', () => {
  const defaultPreferences: UserPreferences = {
    favorites: [],
    history: [],
    uiSettings: {
      darkMode: false,
      itemsPerPage: 12
    }
  };

  const userPreferences = useLocalStorage<UserPreferences>('manga-user-preferences', defaultPreferences);

  const favorites = computed(() => userPreferences.value.favorites);

  const history = computed(() => [...userPreferences.value.history].sort((a, b) => b.timestamp - a.timestamp));

  const addToFavorites = (mangaId: string) => {
    if (!userPreferences.value.favorites.includes(mangaId)) {
      userPreferences.value.favorites.push(mangaId);
    }
  };

  const removeFromFavorites = (mangaId: string) => {
    userPreferences.value.favorites = userPreferences.value.favorites.filter(id => id !== mangaId);
  };

  const toggleFavorite = (mangaId: string) => {
    if (userPreferences.value.favorites.includes(mangaId)) {
      removeFromFavorites(mangaId);
      return false;
    } else {
      addToFavorites(mangaId);
      return true;
    }
  };

  const isFavorite = (mangaId: string) => {
    return userPreferences.value.favorites.includes(mangaId);
  };

  const addToHistory = (mangaId: string) => {
    const historyItem: HistoryItem = {
      mangaId,
      timestamp: Date.now()
    };
    
    userPreferences.value.history = userPreferences.value.history.filter(item => item.mangaId !== mangaId);
    
    userPreferences.value.history.push(historyItem);
    
    if (userPreferences.value.history.length > 20) {
      userPreferences.value.history = userPreferences.value.history
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20);
    }
  };

  const clearHistory = () => {
    userPreferences.value.history = [];
  };

  return {
    userPreferences,
    favorites,
    history,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    addToHistory,
    clearHistory
  };
});