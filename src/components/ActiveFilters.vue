<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();

const activeFilters = computed(() => {
  const filters = [];

  // 検索フィルタ
  if (uiStore.filterOptions.search) {
    filters.push({
      type: 'search',
      label: '検索',
      value: uiStore.filterOptions.search,
      clear: () => uiStore.filterOptions.search = ''
    });
  }

  // ジャンルフィルタ
  uiStore.filterOptions.genres.forEach(genre => {
    filters.push({
      type: 'genre',
      label: 'ジャンル',
      value: genre,
      clear: () => {
        uiStore.filterOptions.genres = uiStore.filterOptions.genres.filter(g => g !== genre);
      }
    });
  });

  // タグフィルタ
  uiStore.filterOptions.tags.forEach(tag => {
    filters.push({
      type: 'tag',
      label: 'タグ',
      value: tag,
      clear: () => {
        uiStore.filterOptions.tags = uiStore.filterOptions.tags.filter(t => t !== tag);
      }
    });
  });

  // ステータスフィルタ
  uiStore.filterOptions.status.forEach(status => {
    const statusLabel = {
      'ongoing': '連載中',
      'completed': '完結',
      'hiatus': '休載中',
      'cancelled': '中止'
    }[status];

    filters.push({
      type: 'status',
      label: 'ステータス',
      value: statusLabel,
      clear: () => {
        uiStore.filterOptions.status = uiStore.filterOptions.status.filter(s => s !== status);
      }
    });
  });

  // 発売年フィルタ
  if (uiStore.filterOptions.yearFrom || uiStore.filterOptions.yearTo) {
    let yearLabel = '';
    if (uiStore.filterOptions.yearFrom && uiStore.filterOptions.yearTo) {
      yearLabel = `${uiStore.filterOptions.yearFrom}年～${uiStore.filterOptions.yearTo}年`;
    } else if (uiStore.filterOptions.yearFrom) {
      yearLabel = `${uiStore.filterOptions.yearFrom}年以降`;
    } else {
      yearLabel = `${uiStore.filterOptions.yearTo}年以前`;
    }

    filters.push({
      type: 'year',
      label: '発売年',
      value: yearLabel,
      clear: () => {
        uiStore.filterOptions.yearFrom = undefined;
        uiStore.filterOptions.yearTo = undefined;
      }
    });
  }

  // 巻数フィルタ
  if (uiStore.filterOptions.chaptersFrom || uiStore.filterOptions.chaptersTo) {
    let chaptersLabel = '';
    if (uiStore.filterOptions.chaptersFrom && uiStore.filterOptions.chaptersTo) {
      chaptersLabel = `${uiStore.filterOptions.chaptersFrom}～${uiStore.filterOptions.chaptersTo}巻`;
    } else if (uiStore.filterOptions.chaptersFrom) {
      chaptersLabel = `${uiStore.filterOptions.chaptersFrom}巻以上`;
    } else {
      chaptersLabel = `${uiStore.filterOptions.chaptersTo}巻以下`;
    }

    filters.push({
      type: 'chapters',
      label: '巻数',
      value: chaptersLabel,
      clear: () => {
        uiStore.filterOptions.chaptersFrom = undefined;
        uiStore.filterOptions.chaptersTo = undefined;
      }
    });
  }

  // 評価フィルタ
  if (uiStore.filterOptions.minRating && uiStore.filterOptions.minRating > 0) {
    filters.push({
      type: 'rating',
      label: '評価',
      value: `${uiStore.filterOptions.minRating}以上`,
      clear: () => {
        uiStore.filterOptions.minRating = 0;
      }
    });
  }

  return filters;
});

const clearAllFilters = () => {
  uiStore.resetFilters();
};

const getChipColor = (type: string) => {
  switch (type) {
    case 'search':
      return 'primary';
    case 'genre':
      return 'deep-purple-lighten-1';
    case 'tag':
      return 'deep-purple-lighten-2';
    case 'status':
      return 'deep-purple-lighten-3';
    case 'year':
      return 'deep-purple-lighten-4';
    case 'chapters':
      return 'deep-purple-lighten-5';
    case 'rating':
      return 'amber-darken-2';
    default:
      return undefined;
  }
};
</script>

<template>
  <div v-if="activeFilters.length > 0" class="active-filters pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-subtitle-1 font-weight-medium primary--text">
        適用中のフィルタ
      </div>
      <v-btn
        color="primary"
        variant="outlined"
        density="comfortable"
        prepend-icon="fas fa-times"
        @click="clearAllFilters"
        class="clear-all-btn"
      >
        すべて解除
      </v-btn>
    </div>

    <div class="filter-chips">
      <v-chip
        v-for="(filter, index) in activeFilters"
        :key="`${filter.type}-${index}`"
        closable
        @click:close="filter.clear"
        class="ma-1 filter-chip"
        :color="getChipColor(filter.type)"
        variant="elevated"
        elevation="2"
      >
        <template v-slot:prepend>
          <v-icon size="small" class="mr-1" :color="filter.type === 'rating' ? 'white' : undefined">
            {{ {
              'search': 'fas fa-search',
              'genre': 'fas fa-theater-masks',
              'tag': 'fas fa-tag',
              'status': 'fas fa-info-circle',
              'year': 'fas fa-calendar',
              'chapters': 'fas fa-book',
              'rating': 'fas fa-star'
            }[filter.type] }}
          </v-icon>
        </template>
        <span class="filter-label" :class="{ 'white--text': filter.type === 'search' || filter.type === 'rating' }">
          {{ filter.label }}:
        </span>
        <span class="filter-value ml-1" :class="{ 'white--text': filter.type === 'search' || filter.type === 'rating' }">
          {{ filter.value }}
        </span>
      </v-chip>
    </div>
  </div>
</template>

<style scoped>
.active-filters {
  background-color: rgb(var(--v-theme-background));
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  transition: all 0.2s ease;
  font-size: 0.875rem !important;
  height: 36px !important;
}

.filter-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.filter-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

.filter-value {
  font-weight: 500;
}

.clear-all-btn {
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

@media (max-width: 600px) {
  .active-filters {
    padding: 12px !important;
    border-radius: 8px;
  }

  .filter-chip {
    height: 32px !important;
    font-size: 0.8125rem !important;
  }
}
</style>
