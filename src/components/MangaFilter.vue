<script setup lang="ts">
import ActiveFilters from './ActiveFilters.vue';
import { ref, watch, computed } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useMangaStore } from '@/stores/manga';

const uiStore = useUIStore();
const mangaStore = useMangaStore();

const searchInput = ref(uiStore.filterOptions.search);
const filterMenuOpen = ref(false);
const ratingError = ref('');

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  return {
    min: currentYear - 50,
    max: currentYear
  };
});

const availableChapters = computed(() => {
  if (!mangaStore.mangaList.length) return { min: 1, max: 100 };
  
  const chapters = mangaStore.mangaList.map(manga => manga.chapters || 0);
  return {
    min: 1,
    max: Math.max(...chapters)
  };
});

const yearRange = computed({
  get: () => [
    uiStore.filterOptions.yearFrom || availableYears.value.min,
    uiStore.filterOptions.yearTo || availableYears.value.max
  ],
  set: (val: [number, number]) => {
    uiStore.filterOptions.yearFrom = val[0];
    uiStore.filterOptions.yearTo = val[1];
  }
});

const chapterRange = computed({
  get: () => [
    uiStore.filterOptions.chaptersFrom || availableChapters.value.min,
    uiStore.filterOptions.chaptersTo || availableChapters.value.max
  ],
  set: (val: [number, number]) => {
    uiStore.filterOptions.chaptersFrom = val[0];
    uiStore.filterOptions.chaptersTo = val[1];
  }
});

const minRating = computed({
  get: () => uiStore.filterOptions.minRating ?? 0,
  set: (val: number) => {
    if (val < 0 || val > 5) {
      ratingError.value = '評価は0から5の間で指定してください';
      return;
    }
    ratingError.value = '';
    uiStore.filterOptions.minRating = val;
  }
});

const ratingOptions = [
  { value: 0, text: '指定なし' },
  { value: 3, text: '3以上' },
  { value: 3.5, text: '3.5以上' },
  { value: 4, text: '4以上' },
  { value: 4.5, text: '4.5以上' },
  { value: 5, text: '5のみ' }
];

let searchTimeout: number | null = null;
watch(searchInput, (newVal) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    uiStore.filterOptions.search = newVal;
  }, 300) as unknown as number;
});

const saveCurrentFilters = () => {
  uiStore.saveFilters();
};

const loadSavedFilters = () => {
  uiStore.loadSavedFilters();
  searchInput.value = uiStore.filterOptions.search;
};

const clearFilters = () => {
  uiStore.resetFilters();
  searchInput.value = '';
  ratingError.value = '';
};
</script>

<template>
  <div class="manga-filter">
    <v-card variant="flat" class="py-2">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchInput"
              prepend-inner-icon="fas fa-search"
              label="タイトル、作者、出版社で検索"
              variant="outlined"
              hide-details
              clearable
              density="comfortable"
              bg-color="surface"
              color="primary"
              class="search-field"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="4" class="d-flex align-center">
            <v-chip-group v-model="uiStore.filterOptions.status" multiple>
              <v-chip filter value="ongoing" color="info" text-color="white">連載中</v-chip>
              <v-chip filter value="completed" color="success" text-color="white">完結</v-chip>
              <v-chip filter value="hiatus" color="warning" text-color="white">休載中</v-chip>
            </v-chip-group>
          </v-col>
          
          <v-col cols="12" md="2" class="d-flex justify-end align-center">
            <v-btn
              prepend-icon="fas fa-filter"
              @click="filterMenuOpen = !filterMenuOpen"
              variant="tonal"
              color="primary"
            >
              絞り込み
            </v-btn>
          </v-col>
        </v-row>
        
        <v-expand-transition>
          <div v-if="filterMenuOpen">
            <v-divider class="my-4"></v-divider>
            
            <v-row>
              <v-col cols="12" md="4">
                <label class="text-subtitle-2 d-block mb-2">ジャンル</label>
                <v-chip-group v-model="uiStore.filterOptions.genres" multiple column>
                  <v-chip v-for="genre in uiStore.availableGenres" :key="genre" filter :value="genre">
                    {{ genre }}
                  </v-chip>
                </v-chip-group>
              </v-col>
              
              <v-col cols="12" md="4">
                <label class="text-subtitle-2 d-block mb-2">タグ</label>
                <v-chip-group v-model="uiStore.filterOptions.tags" multiple column>
                  <v-chip v-for="tag in uiStore.availableTags" :key="tag" filter :value="tag">
                    {{ tag }}
                  </v-chip>
                </v-chip-group>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-row>
                  <v-col cols="12">
                    <label class="text-subtitle-2 d-block mb-2">発売年</label>
                    <v-range-slider
                      v-model="yearRange"
                      :min="availableYears.min"
                      :max="availableYears.max"
                      :step="1"
                      thumb-label="always"
                      color="primary"
                      class="mt-4"
                    >
                      <template v-slot:prepend>
                        <span class="text-caption">{{ yearRange[0] }}年</span>
                      </template>
                      <template v-slot:append>
                        <span class="text-caption">{{ yearRange[1] }}年</span>
                      </template>
                    </v-range-slider>
                  </v-col>
                  
                  <v-col cols="12">
                    <label class="text-subtitle-2 d-block mb-2">巻数</label>
                    <v-range-slider
                      v-model="chapterRange"
                      :min="availableChapters.min"
                      :max="availableChapters.max"
                      :step="1"
                      thumb-label="always"
                      color="primary"
                      class="mt-4"
                    >
                      <template v-slot:prepend>
                        <span class="text-caption">{{ chapterRange[0] }}巻</span>
                      </template>
                      <template v-slot:append>
                        <span class="text-caption">{{ chapterRange[1] }}巻</span>
                      </template>
                    </v-range-slider>
                  </v-col>
                  
                  <v-col cols="12">
                    <label class="text-subtitle-2 d-block mb-2">最低評価</label>
                    <div class="rating-controls d-flex align-center gap-4">
                      <v-select
                        v-model="minRating"
                        :items="ratingOptions"
                        item-title="text"
                        item-value="value"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        class="rating-select"
                        bg-color="surface"
                        color="primary"
                      ></v-select>
                      <div class="rating-stars d-flex align-center">
                        <v-rating
                          v-model="minRating"
                          color="amber"
                          half-increments
                          hover
                          length="5"
                          size="24"
                        >
                          <template v-slot:item="{ props }">
                            <v-btn
                              class="rating-star-btn me-1"
                              :icon="props.isFilled ? 'fas fa-star' : 'far fa-star'"
                              :color="props.isFilled ? 'amber' : 'grey-lighten-1'"
                              size="24"
                              density="comfortable"
                              variant="plain"
                              v-bind="props"
                            ></v-btn>
                          </template>
                        </v-rating>
                        <span class="rating-value ml-2">{{ minRating }}</span>
                      </div>
                    </div>
                    <div v-if="ratingError" class="text-error text-caption mt-1">
                      {{ ratingError }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <div class="filter-actions">
                  <div class="d-flex flex-column flex-md-row gap-3">
                    <v-spacer class="d-none d-md-block"></v-spacer>
                    <v-btn 
                      variant="tonal" 
                      color="error" 
                      @click="clearFilters"
                      prepend-icon="fas fa-undo"
                      class="filter-btn"
                      min-width="160"
                      height="44"
                      :block="$vuetify.display.mdAndDown"
                    >
                      リセット
                    </v-btn>
                    <v-btn 
                      variant="tonal" 
                      color="success" 
                      @click="loadSavedFilters"
                      prepend-icon="fas fa-folder-open"
                      class="filter-btn"
                      min-width="160"
                      height="44"
                      :block="$vuetify.display.mdAndDown"
                    >
                      保存した条件を読み込む
                    </v-btn>
                    <v-btn 
                      variant="elevated" 
                      color="primary"
                      @click="saveCurrentFilters"
                      prepend-icon="fas fa-save"
                      class="filter-btn"
                      min-width="160"
                      height="44"
                      :block="$vuetify.display.mdAndDown"
                    >
                      条件を保存
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-container>
    </v-card>
    <!-- アクティブフィルタの表示 -->
    <ActiveFilters />
  </div>
</template>

<style scoped>
.manga-filter {
  position: relative;
}

.filter-section {
  margin-top: 1rem;
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

/* 検索フィールドのスタイリング */
.search-field {
  border-radius: 8px;
}

.search-field :deep(.v-field) {
  border-radius: 8px !important;
  transition: all 0.2s ease;
}

.search-field :deep(.v-field.v-field--focused) {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.1);
}

.search-field :deep(.v-field__input) {
  padding: 8px 12px;
}

.search-field :deep(.v-field__clearable) {
  padding: 0 8px;
}

.search-field :deep(.v-input__details) {
  display: none;
}

.rating-controls {
  min-height: 40px;
}

.rating-select {
  min-width: 120px;
  max-width: 200px;
}

.rating-select :deep(.v-field) {
  border-radius: 8px !important;
  transition: all 0.2s ease;
}

.rating-select :deep(.v-field.v-field--focused) {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.1);
}

.rating-stars {
  flex-grow: 1;
  height: 40px;
}

.rating-star-btn {
  width: 24px !important;
  height: 24px !important;
  padding: 0 !important;
}

.rating-value {
  min-width: 24px;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 600px) {
  .rating-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .rating-select {
    max-width: 100%;
  }
  
  .rating-stars {
    justify-content: center;
  }
}

.filter-actions {
  margin-top: 24px;
  padding: 0 16px;
}

.filter-btn {
  font-size: 14px !important;
  letter-spacing: 0.5px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  position: relative;
  overflow: hidden;
}

.gap-3 {
  gap: 12px !important;
}

/* レスポンシブ対応 */
@media (max-width: 959px) {
  .filter-actions {
    padding: 0 8px;
  }
  
  .filter-btn {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .gap-3 {
    gap: 16px !important;
  }
}

/* タッチデバイス対応 */
@media (hover: none) {
  .filter-btn {
    min-height: 44px;
  }
}

/* ホバーエフェクト */
@media (hover: hover) {
  .filter-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

/* アクティブ状態 */
.filter-btn:active {
  transform: translateY(1px);
}
</style>
