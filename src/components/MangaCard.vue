<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStorageStore } from '@/stores/storage';
import type { Manga } from '@/types/manga';

const props = defineProps<{
  manga: Manga;
}>();

const router = useRouter();
const storageStore = useStorageStore();
const imageError = ref(false);

const navigateToDetail = () => {
  router.push({ name: 'manga-detail', params: { id: props.manga.id } });
};

const toggleFavorite = (event: Event) => {
  event.stopPropagation();
  storageStore.toggleFavorite(props.manga.id);
};

const statusColor = computed(() => {
  switch (props.manga.completionStatus) {
    case 'completed': return 'success';
    case 'ongoing': return 'info';
    case 'hiatus': return 'warning';
    case 'cancelled': return 'error';
    default: return 'grey';
  }
});

const statusText = computed(() => {
  switch (props.manga.completionStatus) {
    case 'completed': return '完結';
    case 'ongoing': return '連載中';
    case 'hiatus': return '休載中';
    case 'cancelled': return '中止';
    default: return '不明';
  }
});

const authorDisplay = computed(() => {
  if (props.manga.authors && Array.isArray(props.manga.authors)) {
    return props.manga.authors
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

const handleImageError = () => {
  imageError.value = true;
};
</script>

<template>
  <div class="manga-card" @click="navigateToDetail">
    <div class="manga-card-inner">
      <div class="manga-cover-container">
        <v-img
          :src="imageError ? 'https://placehold.co/320x425/e0e0e0/9e9e9e?text=画像なし' : manga.coverImage"
          :alt="manga.title"
          aspect-ratio="3/4"
          cover
          class="manga-cover"
          :lazy-src="'https://placehold.co/180x240/e0e0e0/9e9e9e?text=読み込み中'"
          @error="handleImageError"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        
        <div class="manga-overlay">
          <div class="manga-overlay-content">
            <div class="d-flex justify-space-between align-center mb-2">
              <v-chip
                size="small"
                :color="statusColor"
                text-color="white"
                class="text-caption"
              >
                {{ statusText }}
              </v-chip>
            </div>
            
            <h3 class="manga-title text-subtitle-1 font-weight-bold mb-1">{{ manga.title }}</h3>
            <p class="manga-author text-caption mb-0">{{ authorDisplay }}</p>
          </div>
        </div>
      </div>
      
      <!-- 背表紙風 -->
      <div class="manga-spine">
        <span class="spine-title">{{ manga.title }}</span>
        <span class="spine-author">{{ authorDisplay }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manga-card {
  position: relative;
  cursor: pointer;
  perspective: 1000px;
  width: 100%;
  height: 100%;
}

.manga-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
}

.manga-cover-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 
    -4px 4px 8px rgba(0, 0, 0, 0.1),
    -1px 1px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.manga-cover {
  width: 100%;
  height: 100%;
  transform-origin: left center;
  transition: transform 0.3s ease;
}

.manga-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
}

.manga-overlay-content {
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.manga-spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 24px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.1)
  );
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.spine-title {
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.spine-author {
  font-size: 0.65rem;
}

.manga-title {
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.manga-author {
  color: rgba(255, 255, 255, 0.8);
}

.favorite-btn {
  opacity: 0.8;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.favorite-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Hover effects */
.manga-card:hover .manga-card-inner {
  transform: translateY(-8px);
}

.manga-card:hover .manga-cover-container {
  box-shadow: 
    -6px 6px 12px rgba(0, 0, 0, 0.15),
    -2px 2px 6px rgba(0, 0, 0, 0.1);
}

.manga-card:hover .manga-overlay {
  opacity: 1;
}

.manga-card:hover .manga-overlay-content {
  transform: translateY(0);
}

.manga-card:hover .manga-spine {
  opacity: 1;
}

/* Responsive styles */
@media (max-width: 600px) {
  .manga-overlay {
    padding: 12px;
  }
  
  .manga-title {
    font-size: 0.875rem;
  }
  
  .manga-author {
    font-size: 0.75rem;
  }
}
</style>