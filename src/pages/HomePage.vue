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
console.log(uiStore.uiSettings.itemsPerPage)
const currentPage = ref(1);

useHead({
  title: 'マンガコレクション - 素晴らしいマンガを見つけよう',
  meta: [
    {
      name: 'description',
      content: '日本と世界中の最高のマンガを発見しましょう。新作情報をチェックし、お気に入りを管理できます。'
    },
    {
      name: 'keywords',
      content: 'マンガ, コミック, アニメ, 日本のマンガ, マンガコレクション, マンガおすすめ'
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

// Reset to first page when filters or sort changes
watch([() => uiStore.filterOptions, () => uiStore.sortOption], () => {
  currentPage.value = 1;
});

// Reset to first page when items per page changes
watch(() => uiStore.uiSettings.itemsPerPage, () => {
  currentPage.value = 1;
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
            <p class="text-body-3">
              返金手続き等は全て各販売サイトから行うようお願いいたします。
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