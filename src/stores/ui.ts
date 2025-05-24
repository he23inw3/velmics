import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { FilterOptions, SortOption, UISettings } from '@/types/manga';
import { useLocalStorage } from '@vueuse/core';

export const useUIStore = defineStore('ui', () => {
  const defaultUISettings: UISettings = {
    darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    itemsPerPage: 12
  };

  const uiSettings = useLocalStorage<UISettings>('manga-ui-settings', defaultUISettings);

  const filterOptions = ref<FilterOptions>({
    search: '',
    genres: [],
    tags: [],
    status: [],
    minRating: undefined,
    yearFrom: undefined,
    yearTo: undefined
  });

  const sortOption = ref<SortOption>({
    field: 'releaseDate',
    direction: 'desc'
  });

  const availableGenres = ref<string[]>([]);
  const availableTags = ref<string[]>([]);

  const initializeFilters = (genres: string[], tags: string[]) => {
    availableGenres.value = [...new Set(genres)].sort();
    availableTags.value = [...new Set(tags)].sort();
  };

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

  const saveFilters = () => {
    uiSettings.value.savedFilters = { ...filterOptions.value };
  };

  const loadSavedFilters = () => {
    if (uiSettings.value.savedFilters) {
      filterOptions.value = { ...uiSettings.value.savedFilters };
    }
  };

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
    setItemsPerPage
  };
});