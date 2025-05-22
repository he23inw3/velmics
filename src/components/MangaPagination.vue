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
      >
        <v-icon start>fas fa-angle-double-left</v-icon>
        < 前へ
      </v-btn>
      
      <div class="d-flex">
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
      >
        次へ >
        <v-icon end>fas fa-angle-double-right</v-icon>
      </v-btn>
    </div>
    
    <div class="text-caption text-grey mt-2">
      {{ currentPage }} / {{ totalPages }} ページ
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
</style>