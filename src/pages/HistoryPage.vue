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
  title: '閲覧履歴 | Vestia',
  meta: [
    {
      name: 'description',
      content: '最近閲覧したマンガ作品の履歴を確認できます。'
    }
  ]
});

onMounted(async () => {
  if (mangaStore.mangaList.length === 0) {
    await mangaStore.fetchMangas();
  }
});

const historyItems = computed(() => {
  return storageStore.history.map(item => {
    const manga = mangaStore.getMangaById(item.mangaId);
    if (!manga) return null;
    
    return {
      manga,
      timestamp: item.timestamp
    };
  }).filter(Boolean);
});

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('ja-JP');
};

const clearHistory = () => {
  if (confirm('閲覧履歴を削除してもよろしいですか？')) {
    storageStore.clearHistory();
  }
};
</script>

<template>
  <div class="history-page">
    <AppHeader />
    
    <v-main>
      <div class="history-content">
        <div class="header-section">
          <h1 class="text-h4 text-center brand-logo mb-2">閲覧履歴</h1>
          <p class="text-body-1 text-center text-medium-emphasis mb-0">
            最近閲覧したマンガ作品を20件まで表示します。
          </p>
        </div>
        
        <div v-if="!historyItems || historyItems.length === 0" class="empty-state">
          <v-icon size="64" color="grey">fas fa-history</v-icon>
          <h2 class="text-h5 mt-4">閲覧履歴がありません</h2>
          <p class="text-body-1 mt-2">
            まだマンガの詳細を閲覧していません。
            コレクションを見て、興味のある作品をチェックしてみましょう。
          </p>
          <v-btn to="/" color="primary" class="mt-4" prepend-icon="fas fa-search">
            マンガを探す
          </v-btn>
        </div>
        
        <template v-else>
          <div class="action-bar">
            <v-btn 
              color="error" 
              variant="outlined" 
              prepend-icon="fas fa-trash-alt" 
              @click="clearHistory"
            >
              履歴を削除
            </v-btn>
          </div>
          
          <v-timeline density="comfortable" class="history-timeline">
            <v-timeline-item
              v-for="(item, index) in historyItems"
              :key="index"
              :dot-color="'primary'"
              size="small"
            >
              <template v-slot:icon>
                <v-icon>fas fa-book</v-icon>
              </template>
              
              <template v-slot:opposite>
                <div class="text-caption text-medium-emphasis">
                  {{ formatTimestamp(item.timestamp) }}
                </div>
              </template>
              
              <v-card class="history-card">
                <div class="history-card-content">
                  <div class="thumbnail-container">
                    <v-img
                      :src="item.manga.coverImage"
                      :alt="item.manga.title"
                      width="120"
                      aspect-ratio="3/4"
                      cover
                      class="thumbnail"
                      :lazy-src="'https://placehold.co/180x240/e0e0e0/9e9e9e?text=読み込み中'"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </div>
                  
                  <div class="manga-info">
                    <h3 class="text-h6 mb-2">{{ item.manga.title }}</h3>
                    <div class="d-flex align-center mb-2">
                      <span class="text-body-2 text-medium-emphasis mr-2">{{ item.manga.author }}</span>
                      <v-rating
                        :model-value="item.manga.rating"
                        color="amber"
                        density="compact"
                        size="small"
                        readonly
                      ></v-rating>
                    </div>
                    <p class="text-body-2 description">{{ item.manga.description }}</p>
                    <v-btn
                      :to="`/manga/${item.manga.id}`"
                      color="primary"
                      variant="tonal"
                      size="small"
                      class="mt-2"
                    >
                      詳細を見る
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </template>
      </div>
    </v-main>
    
    <AppFooter />
  </div>
</template>

<style scoped>
.history-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.history-content {
  flex: 1;
  padding: 32px 16px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.header-section {
  margin-bottom: 32px;
}

.empty-state {
  text-align: center;
  padding: 64px 16px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.history-timeline {
  padding: 0 16px;
}

.history-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.history-card-content {
  display: flex;
  gap: 24px;
  padding: 16px;
}

.thumbnail-container {
  flex-shrink: 0;
  width: 120px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.manga-info {
  flex: 1;
  min-width: 0;
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.6);
}

@media (max-width: 600px) {
  .history-content {
    padding: 24px 12px;
  }

  .history-timeline {
    padding: 0 8px;
  }

  .history-card-content {
    flex-direction: column;
    gap: 16px;
  }

  .thumbnail-container {
    width: 100%;
    max-width: 180px;
    margin: 0 auto;
  }

  .manga-info {
    text-align: center;
  }
}

@media (min-width: 960px) {
  .history-content {
    padding: 48px 32px;
  }

  .history-timeline {
    padding: 0 24px;
  }
}
</style>