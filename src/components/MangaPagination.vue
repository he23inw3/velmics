<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
}>();

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
}>();

const maxVisible = props.maxVisiblePages || 5;

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const halfVisible = Math.floor(maxVisible / 2);
  
  let start = Math.max(1, props.currentPage - halfVisible);
  let end = Math.min(props.totalPages, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('...');
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  if (end < props.totalPages) {
    if (end < props.totalPages - 1) pages.push('...');
    pages.push(props.totalPages);
  }
  
  return pages;
});

const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page !== props.currentPage) {
    emit('update:currentPage', page);
  }
};
</script>

<template>
  <div class="d-flex flex-column align-center my-4">
    <div class="d-flex align-center">
      <v-btn
        variant="outlined"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        class="mr-2 pagination-nav-btn"
        size="small"
        color="primary"
        aria-label="前のページへ"
      >
        <v-icon start>fas fa-angle-double-left</v-icon>
        < 前へ
      </v-btn>
      
      <div class="d-flex" role="navigation" aria-label="ページネーション">
        <v-btn
          v-for="page in visiblePages"
          :key="page"
          :color="page === currentPage ? 'primary' : undefined"
          :variant="page === currentPage ? 'flat' : 'outlined'"
          :disabled="page === '...'"
          @click="goToPage(page)"
          class="mx-1"
          size="small"
          min-width="36"
          height="36"
          :aria-label="`${page}ページ目${page === currentPage ? '（現在のページ）' : ''}`"
          :aria-current="page === currentPage ? 'page' : undefined"
        >
          {{ page }}
        </v-btn>
      </div>
      
      <v-btn
        variant="outlined"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
        class="ml-2 pagination-nav-btn"
        size="small"
        color="primary"
        aria-label="次のページへ"
      >
        次へ >
        <v-icon end>fas fa-angle-double-right</v-icon>
      </v-btn>
    </div>
    
    <div 
      class="pagination-info mt-2"
      aria-live="polite"
      role="status"
    >
      <span class="current-page">{{ currentPage }}</span>
      <span class="page-separator">/</span>
      <span class="total-pages">{{ totalPages }}</span>
      <span class="visually-hidden">ページ</span>
    </div>
  </div>
</template>

<style scoped>
.v-btn {
  height: 36px !important;
}

.v-btn--disabled {
  opacity: 0.5;
}

.pagination-nav-btn {
  min-width: 90px !important;
}

.v-icon {
  font-size: 1rem;
}

.pagination-info {
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.875rem;
  font-weight: 500;
}

.current-page {
  color: var(--v-primary-base);
  font-weight: 600;
}

.page-separator {
  margin: 0 4px;
  color: rgba(0, 0, 0, 0.6);
}

.total-pages {
  color: rgba(0, 0, 0, 0.87);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Dark theme support */
:deep(.v-theme--dark) {
  .pagination-info {
    color: rgba(255, 255, 255, 0.87);
  }
  
  .page-separator {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .total-pages {
    color: rgba(255, 255, 255, 0.87);
  }
}
</style>