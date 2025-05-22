<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { Manga } from "@/types/manga";

const props = defineProps<{
  mangas: Manga[];
  title?: string;
}>();

const display = useDisplay();

const gridCols = computed(() => {
  if (display.xs.value) return 2; // スマートフォン
  if (display.sm.value) return 3; // タブレット
  return 4; // デスクトップ
});

const displayedMangas = computed(() => {
  const maxmangas = display.xs.value ? 8 : display.sm.value ? 9 : 8;
  return props.mangas.slice(0, maxmangas);
});

// 画面サイズに応じたフォントサイズの計算
const titleFontSize = computed(() => {
  if (display.xs.value) return "0.875rem"; // 14px
  if (display.sm.value) return "0.9375rem"; // 15px
  return "1rem"; // 16px
});

const priceFontSize = computed(() => {
  if (display.xs.value) return "1.125rem"; // 18px
  if (display.sm.value) return "1.25rem"; // 20px
  return "1.5rem"; // 24px
});
</script>

<template>
  <v-card class="related-mangas" variant="flat">
    <v-card-title class="d-flex justify-space-between align-center pa-4">
      <span class="text-h6">{{ title || "関連マンガ" }}</span>
      <v-btn
        v-if="mangas.length > displayedMangas.length"
        variant="text"
        color="primary"
        class="text-none view-more-btn"
        size="small"
      >
        もっと見る
        <v-icon end>fas fa-chevron-right</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="pa-4">
      <v-row>
        <v-col
          v-for="manga in displayedMangas"
          :key="manga.id"
          :cols="12 / gridCols"
          class="manga-item"
        >
          <div class="manga-card">
            <div class="manga-image-container">
              <v-img
                :src="manga.coverImage"
                :alt="manga.title"
                aspect-ratio="3/4"
                cover
                class="manga-image"
                :lazy-src="'https://placehold.co/180x240/e0e0e0/9e9e9e?text=読み込み中'"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>

            <div class="manga-info pa-2">
              <h3 class="manga-title mb-1" :style="{ fontSize: titleFontSize }">
                {{ manga.title }}
              </h3>

              <div class="d-flex align-center mb-1">
                <v-rating
                  :model-value="manga.rating"
                  color="amber"
                  density="compact"
                  size="x-small"
                  readonly
                  half-increments
                ></v-rating>
                <span class="rating-count">{{ manga.rating }}</span>
              </div>

              {{ (manga as any).relationScore }}
              <div 
                v-if="(manga as any).relationScore"
                class="relation-score text-caption mb-1"
              >
                関連度: {{ (manga as any).relationScore }}
              </div>

              <v-btn
                color="primary"
                variant="flat"
                block
                class="mt-2 action-btn"
                :size="display.xs.value ? 'small' : undefined"
                :to="`/manga/${manga.id}`"
              >
                詳細を見る
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.related-mangas {
  background-color: transparent;
}

.manga-item {
  transition: transform 0.2s ease;
  padding: 8px;
}

.manga-card {
  height: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.manga-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.manga-image-container {
  position: relative;
  overflow: hidden;
}

.manga-image {
  transition: transform 0.3s ease;
}

.manga-card:hover .manga-image {
  transform: scale(1.05);
}

.manga-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  font-weight: 500;
  min-height: 2.8em;
  word-break: break-all;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency {
  font-size: 0.75em;
  color: rgba(0, 0, 0, 0.6);
}

.rating-count {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  margin-left: 4px;
}

.view-more-btn {
  white-space: nowrap;
}

.action-btn {
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

/* スマートフォン向けの最適化 */
@media (max-width: 600px) {
  .manga-item {
    padding: 4px;
  }

  .manga-info {
    padding: 8px !important;
  }

  .view-more-btn {
    font-size: 0.75rem;
  }
}

/* 画面回転対応 */
@media screen and (orientation: landscape) and (max-width: 960px) {
  .manga-item {
    flex: 0 0 25%;
    max-width: 25%;
  }
}
</style>
