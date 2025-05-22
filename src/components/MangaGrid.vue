<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import MangaCard from '@/components/MangaCard.vue';
import { useUIStore } from '@/stores/ui';
import type { Manga } from '@/types/manga';

const props = defineProps<{
  mangas: Manga[];
  loading?: boolean;
}>();

const display = useDisplay();
const uiStore = useUIStore();

const gridColumns = computed(() => {
  if (display.xs.value) return 2;        // < 600px
  if (display.sm.value) return 3;        // 600px - 960px
  return 4;                              // > 960px
});

const mangaRows = computed(() => {
  const rows = [];
  const itemsPerRow = gridColumns.value;
  
  for (let i = 0; i < props.mangas.length; i += itemsPerRow) {
    const row = props.mangas.slice(i, i + itemsPerRow);
    // 最後の行が不完全な場合、空のスペースを追加
    // while (row.length < itemsPerRow) {
    //   row.push(null);
    // }
    rows.push(row);
  }
  
  return rows;
});
</script>

<template>
  <div class="manga-grid">
    <v-slide-y-transition group>
      <div v-if="loading || mangas.length === 0" :key="'message'" class="text-center py-16">
        <template v-if="loading">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <div class="text-h6 mt-4">マンガを読み込み中...</div>
        </template>
        <template v-else>
          <v-icon size="64" color="grey">far fa-sad-tear</v-icon>
          <h2 class="text-h5 mt-4">条件に一致するマンガが見つかりませんでした</h2>
          <p class="text-body-1 mt-2">
            条件を変更して再度検索してください。
          </p>
          <v-btn 
            color="primary" 
            class="mt-4" 
            prepend-icon="fas fa-undo" 
            @click="uiStore.resetFilters"
          >
            条件をリセット
          </v-btn>
        </template>
      </div>
      
      <div v-else :key="'grid'" class="manga-grid-container">
        <div class="bookshelf">
          <div class="shelf-edge-top"></div>
          <div class="shelf-content">
            <div 
              v-for="(row, rowIndex) in mangaRows" 
              :key="rowIndex"
              class="shelf-row"
            >
              <div class="shelf-row-content">
                <div
                  v-for="(manga, colIndex) in row"
                  :key="manga?.id || `empty-${rowIndex}-${colIndex}`"
                  class="manga-item"
                >
                  <MangaCard v-if="manga" :manga="manga" />
                  <div v-else class="empty-space"></div>
                </div>
              </div>
              <div 
                v-if="rowIndex < mangaRows.length - 1"
                class="shelf-row-divider"
              >
                <div class="shelf-row-shadow"></div>
              </div>
            </div>
          </div>
          <div class="shelf-edge-bottom"></div>
        </div>
      </div>
    </v-slide-y-transition>
  </div>
</template>

<style scoped>
.manga-grid {
  width: 100%;
}

.manga-grid-container {
  padding: 20px 0;
  margin: 0 auto;
  max-width: 1440px;
}

.bookshelf {
  position: relative;
  margin: 40px auto;
  background: #F5F5F5;
  border-radius: 8px;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.1),
    inset 0 -2px 0 rgba(0, 0, 0, 0.05);
  width: 100%;
}

.shelf-content {
  padding: 20px 30px;
  min-height: 400px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.02) 0%,
    rgba(0, 0, 0, 0.04) 100%
  );
}

.shelf-row {
  position: relative;
  margin-bottom: 40px;
}

.shelf-row:last-child {
  margin-bottom: 0;
}

.shelf-row-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 20px 0;
  position: relative;
  z-index: 1;
}

.shelf-row-divider {
  position: absolute;
  bottom: -20px;
  left: -30px;
  right: -30px;
  height: 20px;
  background: linear-gradient(
    to bottom,
    #E0E0E0,
    #BDBDBD
  );
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.shelf-row-shadow {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),
    transparent
  );
}

.shelf-edge-top {
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(
    to bottom,
    #E0E0E0,
    #BDBDBD
  );
  border-radius: 8px 8px 0 0;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 -1px 3px rgba(0, 0, 0, 0.1);
}

.shelf-edge-bottom {
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(
    to bottom,
    #BDBDBD,
    #9E9E9E
  );
  border-radius: 0 0 8px 8px;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.15);
}

.manga-item {
  height: 100%;
  min-height: 360px;
}

.empty-space {
  width: 100%;
  height: 100%;
  min-height: 360px;
}

.manga-item:hover {
  transform: translateY(-10px) scale(1.02);
  z-index: 2;
}

@media (max-width: 960px) {
  .shelf-row-content {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .manga-item,
  .empty-space {
    min-height: 320px;
  }
}

@media (max-width: 600px) {
  .shelf-content {
    padding: 10px 15px;
  }
  
  .shelf-row-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .manga-item,
  .empty-space {
    min-height: 280px;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>