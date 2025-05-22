<script setup lang="ts">
import { computed } from 'vue';
import type { Manga } from '@/types/manga';

const props = defineProps<{
  manga: Manga;
}>();

const hasMediaMix = computed(() => {
  const mediaMix = props.manga.mediaMix;
  return mediaMix && (
    mediaMix.anime?.available ||
    mediaMix.movie?.available ||
    mediaMix.drama?.available ||
    mediaMix.game?.available ||
    mediaMix.merchandise?.figures?.available ||
    mediaMix.merchandise?.other?.available
  );
});

const hasAnime = computed(() => props.manga.mediaMix?.anime?.available);
const hasMovie = computed(() => props.manga.mediaMix?.movie?.available);
const hasGame = computed(() => props.manga.mediaMix?.game?.available);
const hasFigures = computed(() => props.manga.mediaMix?.merchandise?.figures?.available);
const hasOtherMerchandise = computed(() => props.manga.mediaMix?.merchandise?.other?.available);
</script>

<template>
  <v-card v-if="hasMediaMix" class="media-mix-section mb-8" elevation="2">
    <v-card-title class="text-h5 font-weight-bold primary--text pa-4">
      メディアミックス展開
    </v-card-title>
    
    <v-card-text class="pa-4">
      <v-row>
        <!-- アニメ -->
        <v-col v-if="hasAnime" cols="12" sm="6" md="4">
          <v-card class="media-card" variant="outlined">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">fas fa-tv</v-icon>
              アニメ
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-column gap-2">
                <v-btn
                  v-if="manga.mediaMix?.anime?.links?.official"
                  :href="manga.mediaMix.anime.links.official"
                  target="_blank"
                  color="primary"
                  variant="outlined"
                  prepend-icon="fas fa-external-link-alt"
                >
                  公式サイト
                </v-btn>
                <v-btn
                  v-if="manga.mediaMix?.anime?.links?.amazon"
                  :href="manga.mediaMix.anime.links.amazon"
                  target="_blank"
                  color="orange"
                  variant="outlined"
                  prepend-icon="fas fa-play"
                >
                  AmazonPrimeVideoで視聴
                </v-btn>
                <v-btn
                  v-if="manga.mediaMix?.anime?.links?.netflix"
                  :href="manga.mediaMix.anime.links.netflix"
                  target="_blank"
                  color="red"
                  variant="outlined"
                  prepend-icon="fas fa-play"
                >
                  Netflixで視聴
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 映画 -->
        <v-col v-if="hasMovie" cols="12" sm="6" md="4">
          <v-card class="media-card" variant="outlined">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">fas fa-film</v-icon>
              映画
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-column gap-2">
                <v-btn
                  v-if="manga.mediaMix?.movie?.links?.official"
                  :href="manga.mediaMix.movie.links.official"
                  target="_blank"
                  color="primary"
                  variant="outlined"
                  prepend-icon="fas fa-external-link-alt"
                >
                  公式サイト
                </v-btn>
                <v-btn
                  v-if="manga.mediaMix?.movie?.links?.trailer"
                  :href="manga.mediaMix.movie.links.trailer"
                  target="_blank"
                  color="red"
                  variant="outlined"
                  prepend-icon="fas fa-play"
                >
                  予告編を見る
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- ゲーム -->
        <v-col v-if="hasGame" cols="12" sm="6" md="4">
          <v-card class="media-card" variant="outlined">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">fas fa-gamepad</v-icon>
              ゲーム
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-column gap-2">
                <v-btn
                  v-if="manga.mediaMix?.game?.links?.official"
                  :href="manga.mediaMix.game.links.official"
                  target="_blank"
                  color="primary"
                  variant="outlined"
                  prepend-icon="fas fa-external-link-alt"
                >
                  公式サイト
                </v-btn>
                <v-btn
                  v-if="manga.mediaMix?.game?.links?.store"
                  :href="manga.mediaMix.game.links.store"
                  target="_blank"
                  color="success"
                  variant="outlined"
                  prepend-icon="fas fa-shopping-cart"
                >
                  ストアで購入
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- フィギュア -->
        <v-col v-if="hasFigures" cols="12" sm="6" md="4">
          <v-card class="media-card" variant="outlined">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">fas fa-trophy</v-icon>
              フィギュア
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="figure in manga.mediaMix?.merchandise?.figures?.items"
                  :key="figure.name"
                  :href="figure.link"
                  target="_blank"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-img
                      :src="figure.image"
                      :alt="figure.name"
                      width="80"
                      height="80"
                      cover
                      class="rounded-lg"
                    ></v-img>
                  </template>
                  
                  <v-list-item-title>{{ figure.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ figure.manufacturer }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="mt-1">
                    ¥{{ figure.price.toLocaleString() }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- その他グッズ -->
        <v-col v-if="hasOtherMerchandise" cols="12" sm="6" md="4">
          <v-card class="media-card" variant="outlined">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2">fas fa-shopping-bag</v-icon>
              グッズ
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="item in manga.mediaMix?.merchandise?.other?.items"
                  :key="item.name"
                  :href="item.link"
                  target="_blank"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-img
                      :src="item.image"
                      :alt="item.name"
                      width="80"
                      height="80"
                      cover
                      class="rounded-lg"
                    ></v-img>
                  </template>
                  
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.category }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="mt-1">
                    ¥{{ item.price.toLocaleString() }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.media-mix-section {
  overflow: hidden;
}

.media-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.media-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.gap-2 {
  gap: 8px;
}

/* レスポンシブ対応 */
@media (max-width: 959px) {
  .v-col {
    padding: 8px;
  }
}

@media (max-width: 599px) {
  .media-card {
    margin-bottom: 16px;
  }
}

/* アクセシビリティ対応 */
.v-btn:focus-visible {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

.v-list-item:focus-visible {
  outline: 2px solid var(--v-primary-base);
  outline-offset: -2px;
}
</style>