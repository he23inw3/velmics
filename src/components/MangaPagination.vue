<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
}>();

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  
  // すべてのページを表示
  for (let i = 1; i <= props.totalPages; i++) {
    if (i === 1 || i === props.totalPages || Math.abs(i - props.currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  
  return pages;
});

const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page !== props.currentPage) {
    emit('update:currentPage', page);
  }
};

const isCurrentPage = (page: number | string) => {
  return page === props.currentPage;
};

const isEllipsis = (page: number | string) => {
  return page === '...';
};
</script>

<template>
  <nav aria-label="ページナビゲーション" class="pagination">
    <div class="pagination-container">
      <v-btn
        variant="outlined"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        class="nav-btn"
        size="small"
        color="primary"
        aria-label="前のページへ"
      >
        <v-icon start>fas fa-angle-left</v-icon>
        前へ
      </v-btn>
      
      <div class="page-numbers" role="group" aria-label="ページ番号">
        <v-btn
          v-for="page in visiblePages"
          :key="page"
          :variant="isCurrentPage(page) ? 'flat' : 'outlined'"
          :color="isCurrentPage(page) ? 'primary' : undefined"
          :disabled="isCurrentPage(page) || isEllipsis(page)"
          size="small"
          class="page-button"
          :class="{
            'current': isCurrentPage(page),
            'ellipsis': isEllipsis(page)
          }"
          @click="goToPage(page)"
          :aria-current="isCurrentPage(page) ? 'page' : undefined"
          :aria-label="isEllipsis(page) ? '省略されたページ' : `${page}ページへ`"
        >
          {{ page }}
        </v-btn>
      </div>
      
      <v-btn
        variant="outlined"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
        class="nav-btn"
        size="small"
        color="primary"
        aria-label="次のページへ"
      >
        次へ
        <v-icon end>fas fa-angle-right</v-icon>
      </v-btn>
    </div>
    
    <div class="page-info" aria-live="polite" role="status">
      {{ currentPage }} / {{ totalPages }} ページ
    </div>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0 0.5rem;
}

.page-button {
  min-width: 36px !important;
  width: 36px;
  height: 36px !important;
  padding: 0 !important;
}

.page-button.current {
  font-weight: 500;
}

.page-button.ellipsis {
  border: none !important;
  background: none !important;
  color: var(--v-grey-base) !important;
  cursor: default;
}

.nav-btn {
  min-width: 80px;
}

.page-info {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--v-grey-darken-1);
}

@media (max-width: 600px) {
  .nav-btn {
    min-width: 60px;
    font-size: 0.875rem;
  }
  
  .page-button {
    min-width: 32px !important;
    width: 32px;
    height: 32px !important;
    font-size: 0.875rem;
  }
  
  .page-numbers {
    gap: 0.125rem;
  }
}
</style>
