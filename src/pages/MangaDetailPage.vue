<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { marked } from 'marked';
import { useMangaStore } from '@/stores/manga';
import { useStorageStore } from '@/stores/storage';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import MediaMixSection from '@/components/MediaMixSection.vue';
import RelatedManga from '@/components/RelatedManga.vue';

const route = useRoute();
const mangaStore = useMangaStore();
const storageStore = useStorageStore();

const manga = computed(() => {
  const id = route.params.id as string;
  return mangaStore.getMangaById(id);
});

const authorDisplay = computed(() => {
  if (manga.value.authors && Array.isArray(manga.value.authors)) {
    return manga.value.authors
      .map(author => {
        let suffix = '';
        switch (author.role) {
          case 'writer': suffix = '（原作）'; break;
          case 'artist': suffix = '（作画）'; break;
        }
        return author.name + suffix;
      })
      .join(' / ');
  }
  return '作者不明';
});

const isFavorite = computed(() => {
  if (!manga.value) return false;
  return storageStore.isFavorite(manga.value.id);
});

const toggleFavorite = () => {
  if (manga.value) {
    storageStore.toggleFavorite(manga.value.id);
  }
};

const relatedMangas = computed(() => {
  if (!manga.value) return [];
  return mangaStore.getRelatedMangas(manga.value);
});

const parsedDescrionValue = computed(() => {
  if (!manga.value?.description) return '';
  return marked(manga.value.description);
});

const parsedEditorialReview = computed(() => {
  if (!manga.value?.editorialReview) return '';
  return marked(manga.value.editorialReview);
});

onMounted(async () => {
  if (mangaStore.mangaList.length === 0) {
    await mangaStore.fetchMangas();
  }
});

useHead(() => ({
  title: manga.value ? `${manga.value.title} | マンガコレクション` : 'マンガ詳細',
  meta: [
    {
      name: 'description',
      content: manga.value?.description || 'マンガの詳細情報'
    }
  ]
}));
</script>

<template>
  <div>
    <AppHeader />
    
    <v-main>
      <template v-if="manga">
        <div 
          class="manga-banner" 
          :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${manga.bannerImage || manga.coverImage})` }"
        >
          <v-container>
            <v-row>
              <v-col cols="12" md="3">
                <v-img
                  :src="manga.coverImage"
                  :alt="manga.title"
                  width="100%"
                  max-width="300"
                  class="mx-auto rounded-lg"
                  cover
                ></v-img>
              </v-col>
              
              <v-col cols="12" md="9" class="d-flex flex-column justify-center text-white">
                <div class="d-flex align-center mb-4">
                  <h1 class="text-h3 font-weight-bold mr-4">{{ manga.title }}</h1>
                  <button 
                    class="favorite-btn"
                    :class="{ 'is-favorite': isFavorite }"
                    @click="toggleFavorite"
                    :aria-label="isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'"
                  >
                    <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
                  </button>
                </div>
                
                <div v-if="manga.originalTitle" class="text-h5 mb-4">
                  {{ manga.originalTitle }}
                </div>
                
                <div class="d-flex align-center mb-4">
                  <v-rating
                    v-model="manga.rating"
                    color="amber"
                    half-increments
                    readonly
                  ></v-rating>
                  <span class="text-h6 ml-2">{{ manga.rating }}</span>
                </div>
                
                <div class="tag-section mb-4">
                  <div class="tag-group">
                    <div class="tag-label">ジャンル</div>
                    <div class="tag-list">
                      <v-chip
                        v-for="genre in manga.genres"
                        :key="genre"
                        color="primary"
                        variant="elevated"
                        class="tag-chip"
                        size="large"
                      >
                        {{ genre }}
                      </v-chip>
                    </div>
                  </div>
                </div>

                <div class="tag-section mb-4">
                  <div class="tag-group">
                    <div class="tag-label">タグ</div>
                    <div class="tag-list">
                      <v-chip
                        v-for="tag in manga.tags"
                        :key="tag"
                        color="secondary"
                        variant="elevated"
                        class="tag-chip"
                        size="large"
                      >
                        {{ tag }}
                      </v-chip>
                    </div>
                  </div>
                </div>
                
                <div class="d-flex flex-wrap align-center mb-4">
                  <div class="mr-6 mb-2">
                    <div class="text-caption">作者</div>
                    <div class="text-h6">{{authorDisplay }}</div>
                  </div>
                  
                  <div class="mr-6 mb-2">
                    <div class="text-caption">出版社</div>
                    <div class="text-h6">{{ manga.publisher }}</div>
                  </div>
                  
                  <div class="mr-6 mb-2">
                    <div class="text-caption">発売日</div>
                    <div class="text-h6">
                      {{ new Date(manga.releaseDate).toLocaleDateString('ja-JP') }}
                    </div>
                  </div>
                  
                  <div class="mr-6 mb-2">
                    <div class="text-caption">ステータス</div>
                    <v-chip
                      :color="manga.completionStatus === 'completed' ? 'success' : 'info'"
                      class="text-h6"
                    >
                      {{ manga.completionStatus === 'completed' ? '完結' : '連載中' }}
                    </v-chip>
                  </div>
                </div>
                
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-btn
                      v-if="manga.affiliateLinks?.amazon"
                      :href="manga.affiliateLinks.amazon"
                      target="_blank"
                      color="white"
                      size="large"
                      class="amazon-btn"
                      block
                    >
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
                        alt="amazon" 
                        height="24"
                        class="mr-2"
                      />
                      で購入
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-btn
                      v-if="manga.affiliateLinks?.dmm"
                      :href="manga.affiliateLinks.dmm"
                      target="_blank"
                      color="white"
                      size="large"
                      class="dmm-btn"
                      block
                    >
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/b/bd/DMMcom_logo.svg" 
                        alt="dmm" 
                        height="24"
                        class="mr-2"
                      />
                      で購入
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </div>
        
        <v-container class="py-8">
          <!-- Description Section -->
          <v-card class="mb-8" elevation="2">
            <v-card-title class="text-h5 font-weight-bold primary--text pa-4">
              あらすじ
            </v-card-title>
            <hr />
            <v-card-text class="text-body-1">
              <div v-html="parsedDescrionValue"></div>
            </v-card-text>
          </v-card>

          <!-- Editorial Review Section -->
          <v-card v-if="manga.editorialReview" class="mb-8" elevation="2">
            <v-card-title class="text-h5 font-weight-bold primary--text pa-4">
              サイト管理者コメント
            </v-card-title>
            <hr />
            <v-card-text>
              <div class="editorial-review" v-html="parsedEditorialReview"></div>
            </v-card-text>
          </v-card>
          
          <!-- Media Mix Section -->
          <MediaMixSection :manga="manga" />
          
          <!-- Related Manga Section -->
          <v-card v-if="relatedMangas.length > 0" class="mb-8" elevation="2">
            <RelatedManga
              :mangas="relatedMangas"
              title="関連するお勧めマンガ"
            />
          </v-card>
        </v-container>
      </template>
      
      <v-container v-else class="py-16">
        <div class="text-center">
          <v-progress-circular
            v-if="mangaStore.isLoading"
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <template v-else>
            <v-icon size="64" color="grey">fas fa-book-dead</v-icon>
            <h2 class="text-h4 mt-4">マンガが見つかりません</h2>
            <p class="text-body-1 mt-2">
              指定されたマンガは存在しないか、削除された可能性があります。
            </p>
            <v-btn
              to="/"
              color="primary"
              class="mt-4"
              prepend-icon="fas fa-home"
            >
              ホームに戻る
            </v-btn>
          </template>
        </div>
      </v-container>
    </v-main>
    
    <AppFooter />
  </div>
</template>

<style scoped>
.manga-banner {
  padding: 60px 0;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.tag-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tag-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  font-size: 0.875rem !important;
  height: 32px !important;
  font-weight: 500 !important;
  letter-spacing: 0.02em !important;
}

.favorite-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 24px;
  color: #FF69B4;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.favorite-btn:not(.is-favorite) {
  opacity: 0.8;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn:active {
  transform: scale(0.95);
}

.amazon-btn {
  background-color: #fff !important;
  color: #000 !important;
}

.dmm-btn {
  background-color: #fff !important;
  color: #000 !important;
}

:deep(.editorial-review) {
  font-family: 'Noto Sans JP', sans-serif;
  line-height: 1.8;
  
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--v-primary-base);
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 1rem;
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 1.2rem 0 0.8rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  ul, ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  blockquote {
    border-left: 4px solid var(--v-primary-base);
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background-color: rgba(var(--v-primary-base), 0.1);
    font-style: italic;
  }
  
  code {
    background-color: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
  }
  
  hr {
    margin: 2rem 0;
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>