<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import { useMangaStore } from '@/stores/manga';
import { useStorageStore } from '@/stores/storage';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import MangaGrid from '@/components/MangaGrid.vue';

const mangaStore = useMangaStore();
const storageStore = useStorageStore();

useHead({
  title: 'お気に入り | マンガコレクション',
  meta: [
    {
      name: 'description',
      content: 'お気に入りに登録したマンガ作品を管理できます。'
    }
  ]
});

onMounted(async () => {
  if (mangaStore.mangaList.length === 0) {
    await mangaStore.fetchMangas();
  }
});

const favoriteMangas = computed(() => {
  if (!storageStore.favorites || !mangaStore.mangaList.length) return [];
  return storageStore.favorites
    .map(id => mangaStore.getMangaById(id))
    .filter(Boolean);
});

const clearAllFavorites = () => {
  if (confirm('お気に入りをすべて削除してもよろしいですか？')) {
    storageStore.favorites.forEach(id => {
      storageStore.removeFromFavorites(id);
    });
  }
};
</script>

<template>
  <div>
    <AppHeader />
    
    <v-main>
      <v-container class="py-8">
        <v-card class="mb-6" variant="outlined">
          <v-card-title class="text-center text-h4 py-4 font-weight-bold primary--text">
            お気に入りマンガ
          </v-card-title>
          <v-card-text class="text-center pb-4">
            <p class="text-body-1">
              お気に入りに登録したマンガ作品を一覧で確認できます。<br />
            </p>
            <p class="text-body-2" style="color: red;">
              ブラウザの履歴を消すと、お気に入りマンガも削除されるのでご容赦ください。
            </p>
          </v-card-text>
        </v-card>
        
        <div v-if="mangaStore.isLoading" class="text-center py-16">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <div class="text-h6 mt-4">読み込み中...</div>
        </div>
        
        <div v-else-if="!favoriteMangas.length" class="text-center py-16">
          <v-icon size="64" color="grey">far fa-heart</v-icon>
          <h2 class="text-h5 mt-4">お気に入りがありません</h2>
          <p class="text-body-1 mt-2">
            まだお気に入りに登録したマンガがありません。
            コレクションを見て、ハートアイコンをクリックすると、お気に入りに追加できます。
          </p>
          <v-btn to="/" color="primary" class="mt-4" prepend-icon="fas fa-search">
            マンガを探す
          </v-btn>
        </div>
        
        <template v-else>
          <div class="d-flex justify-end mb-4">
            <v-btn 
              color="error" 
              variant="outlined" 
              prepend-icon="fas fa-trash-alt" 
              @click="clearAllFavorites"
            >
              すべて削除
            </v-btn>
          </div>
          
          <MangaGrid :mangas="favoriteMangas" />
        </template>
      </v-container>
    </v-main>
    
    <AppFooter />
  </div>
</template>