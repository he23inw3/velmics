<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { useMangaStore } from '@/stores/manga';
import { useUIStore } from '@/stores/ui';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import MangaFilter from '@/components/MangaFilter.vue';
import MangaSort from '@/components/MangaSort.vue';
import MangaGrid from '@/components/MangaGrid.vue';
import MangaPagination from '@/components/MangaPagination.vue';
import AnnouncementBar from '@/components/AnnouncementBar.vue';

const mangaStore = useMangaStore();
const uiStore = useUIStore();
const currentPage = ref(1);

useHead({
  title: 'Velmics - 素晴らしいマンガを見つけよう',
  meta: [
    {
      name: 'description',
      content: '最高の漫画を発見しましょう。'
    },
    {
      name: 'keywords',
      content: 'マンガ, 漫画, コミック, アニメ, 日本のマンガ, マンガコレクション, マンガおすすめ'
    }
  ]
});

onMounted(async () => {
  await mangaStore.fetchMangas();
  
  if (mangaStore.mangaList.length > 0) {
    const allGenres: string[] = [];
    const allTags: string[] = [];
    
    mangaStore.mangaList.forEach(manga => {
      allGenres.push(...manga.genres);
      allTags.push(...manga.tags);
    });
    
    uiStore.initializeFilters(allGenres, allTags);
  }
});

const filteredMangas = computed(() => {
  return mangaStore.filterMangas(uiStore.filterOptions);
});

const sortedMangas = computed(() => {
  return mangaStore.sortMangas(filteredMangas.value, uiStore.sortOption);
});

const totalPages = computed(() => {
  return Math.ceil(sortedMangas.value.length / uiStore.uiSettings.itemsPerPage);
});

const displayedMangas = computed(() => {
  const start = (currentPage.value - 1) * uiStore.uiSettings.itemsPerPage;
  const end = start + uiStore.uiSettings.itemsPerPage;
  return sortedMangas.value.slice(start, end);
});

watch([
  () => uiStore.filterOptions,
  () => uiStore.sortOption,
  () => uiStore.uiSettings.itemsPerPage
], () => {
  currentPage.value = 1;
}, { deep: true });

watch(totalPages, (newTotalPages) => {
  if (currentPage.value > newTotalPages) {
    currentPage.value = Math.max(1, newTotalPages);
  }
});
</script>

<template>
  <div>
    <AppHeader />
    
    <v-main>
      <v-container class="py-8">
        <AnnouncementBar />
        
        <v-card class="mb-6" variant="outlined">
          <v-card-title class="text-center brand-logo text-h4 py-4 font-weight-bold primary--text">
            Velmics
          </v-card-title>
          <v-card-text class="text-center pb-4">
            <p class="text-body-1">
              私が読んで面白かったマンガを紹介します。
            </p>
            <p class="text-body-2">
              各記事の内容は参考程度に受け止めてもらえると助かります。
            </p>
          </v-card-text>
        </v-card>
        
        <MangaFilter />
        
        <v-card class="my-6" variant="outlined">
          <MangaSort
            :total-items="sortedMangas.length"
            :current-page="currentPage"
            :items-per-page="uiStore.uiSettings.itemsPerPage"
          />
        </v-card>
        
        <MangaGrid 
          :mangas="displayedMangas" 
          :loading="mangaStore.isLoading" 
        />
        
        <MangaPagination
          v-if="totalPages > 1"
          v-model:currentPage="currentPage"
          :total-pages="totalPages"
          :max-visible-pages="5"
        />
      </v-container>
    </v-main>
    
    <AppFooter />
  </div>
</template>