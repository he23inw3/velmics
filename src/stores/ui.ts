import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { FilterOptions, SortOption, UISettings } from '@/types/manga';
import { useLocalStorage } from '@vueuse/core';

export const useUIStore = defineStore('ui', () => {
  // Default UI settings
  const defaultUISettings: UISettings = {
    darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    itemsPerPage: 12
  };

  // Get UI settings from local storage or use defaults
  const uiSettings = useLocalStorage<UISettings>('manga-ui-settings', defaultUISettings);

  // Filter options
  const filterOptions = ref<FilterOptions>({
    search: '',
    genres: [],
    tags: [],
    status: [],
    minRating: undefined,
    yearFrom: undefined,
    yearTo: undefined
  });

  // Sort options
  const sortOption = ref<SortOption>({
    field: 'releaseDate',
    direction: 'desc'
  });

  // Available genres and tags (will be populated from manga data)
  const availableGenres = ref<string[]>([]);
  const availableTags = ref<string[]>([]);

  // Initialize genres and tags from manga data
  const initializeFilters = (genres: string[], tags: string[]) => {
    availableGenres.value = [...new Set(genres)].sort();
    availableTags.value = [...new Set(tags)].sort();
  };

  // Reset filters to default
  const resetFilters = () => {
    filterOptions.value = {
      search: '',
      genres: [],
      tags: [],
      status: [],
      minRating: undefined,
      yearFrom: undefined,
      yearTo: undefined
    };
  };

  // Save current filters
  const saveFilters = () => {
    uiSettings.value.savedFilters = { ...filterOptions.value };
  };

  // Load saved filters
  const loadSavedFilters = () => {
    if (uiSettings.value.savedFilters) {
      filterOptions.value = { ...uiSettings.value.savedFilters };
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    uiSettings.value.darkMode = !uiSettings.value.darkMode;
  };

  // Set items per page
  const setItemsPerPage = (count: number) => {
    uiSettings.value.itemsPerPage = count;
  };

  return {
    uiSettings,
    filterOptions,
    sortOption,
    availableGenres,
    availableTags,
    initializeFilters,
    resetFilters,
    saveFilters,
    loadSavedFilters,
    toggleDarkMode,
    setItemsPerPage
  };
});