import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { HistoryItem, UserPreferences } from '@/types/manga';

export const useStorageStore = defineStore('storage', () => {
  // Default user preferences
  const defaultPreferences: UserPreferences = {
    favorites: [],
    history: [],
    uiSettings: {
      darkMode: false,
      itemsPerPage: 12
    }
  };

  // Get user preferences from local storage or use defaults
  const userPreferences = useLocalStorage<UserPreferences>('manga-user-preferences', defaultPreferences);

  // Computed property for accessing favorites
  const favorites = computed(() => userPreferences.value.favorites);

  // Computed property for accessing history in reverse chronological order
  const history = computed(() => [...userPreferences.value.history].sort((a, b) => b.timestamp - a.timestamp));

  // Add manga to favorites
  const addToFavorites = (mangaId: string) => {
    if (!userPreferences.value.favorites.includes(mangaId)) {
      userPreferences.value.favorites.push(mangaId);
    }
  };

  // Remove manga from favorites
  const removeFromFavorites = (mangaId: string) => {
    userPreferences.value.favorites = userPreferences.value.favorites.filter(id => id !== mangaId);
  };

  // Toggle favorite status
  const toggleFavorite = (mangaId: string) => {
    if (userPreferences.value.favorites.includes(mangaId)) {
      removeFromFavorites(mangaId);
      return false;
    } else {
      addToFavorites(mangaId);
      return true;
    }
  };

  // Check if manga is in favorites
  const isFavorite = (mangaId: string) => {
    return userPreferences.value.favorites.includes(mangaId);
  };

  // Add manga to history
  const addToHistory = (mangaId: string) => {
    // Create history item
    const historyItem: HistoryItem = {
      mangaId,
      timestamp: Date.now()
    };
    
    // Remove existing entry for the same manga if present
    userPreferences.value.history = userPreferences.value.history.filter(item => item.mangaId !== mangaId);
    
    // Add new history item
    userPreferences.value.history.push(historyItem);
    
    // Limit history to maximum 20 items
    if (userPreferences.value.history.length > 20) {
      userPreferences.value.history = userPreferences.value.history
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20);
    }
  };

  // Clear all history
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