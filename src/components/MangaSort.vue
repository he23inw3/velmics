<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '@/stores/ui';

const props = defineProps<{
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}>();

const uiStore = useUIStore();

const sortOptions = [
  { text: '新着順', value: { field: 'releaseDate', direction: 'desc' } },
  { text: '古い順', value: { field: 'releaseDate', direction: 'asc' } },
  { text: '評価が高い順', value: { field: 'rating', direction: 'desc' } },
  { text: '評価が低い順', value: { field: 'rating', direction: 'asc' } },
  { text: 'タイトル昇順', value: { field: 'title', direction: 'asc' } },
  { text: 'タイトル降順', value: { field: 'title', direction: 'desc' } },
  { text: '巻数が多い順', value: { field: 'chapters', direction: 'desc' } },
  { text: '巻数が少ない順', value: { field: 'chapters', direction: 'asc' } },
];

const itemsPerPageOptions = [
  { text: '12件表示', value: 12 },
  { text: '24件表示', value: 24 },
  { text: '36件表示', value: 36 },
  { text: '48件表示', value: 48 },
];

const selectedSort = computed({
  get: () => {
    return sortOptions.find(option => 
      option.value.field === uiStore.sortOption.field && 
      option.value.direction === uiStore.sortOption.direction
    )?.value || sortOptions[0].value;
  },
  set: (val) => {
    uiStore.sortOption.field = val.field;
    uiStore.sortOption.direction = val.direction;
  }
});

const displayRange = computed(() => {
  if (props.totalItems === 0) {
    return '該当する作品が見つかりません(0/0件)';
  }
  
  const start = (props.currentPage - 1) * props.itemsPerPage + 1;
  const end = Math.min(start + props.itemsPerPage - 1, props.totalItems);
  
  if (props.totalItems <= props.itemsPerPage) {
    return `全${props.totalItems}件を表示中`;
  }
  
  return `全${props.totalItems}件中${end - start + 1}件を表示中 (${start}-${end}件目)`;
});
</script>

<template>
  <div class="manga-sort pa-4">
    <div class="sort-container">
      <v-row align="center" justify="space-between">
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="selectedSort"
            :items="sortOptions"
            item-title="text"
            item-value="value"
            label="並び替え"
            variant="outlined"
            density="comfortable"
            hide-details
            class="sort-select"
            bg-color="surface"
            color="primary"
          >
            <template v-slot:prepend>
              <v-icon color="primary">fas fa-sort</v-icon>
            </template>
          </v-select>
        </v-col>

        <v-col cols="12" sm="6" md="4" class="text-sm-end">
          <v-select
            v-model="uiStore.uiSettings.itemsPerPage"
            :items="itemsPerPageOptions"
            item-title="text"
            item-value="value"
            label="表示件数"
            variant="outlined"
            density="comfortable"
            hide-details
            class="display-select"
            bg-color="surface"
            color="primary"
          >
            <template v-slot:prepend>
              <v-icon color="primary">fas fa-list</v-icon>
            </template>
          </v-select>
        </v-col>

        <v-col cols="12" class="text-center mt-4">
          <div class="text-body-2 text-medium-emphasis">
            {{ displayRange }}
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
.manga-sort {
  background-color: rgb(var(--v-theme-background));
}

.sort-container {
  max-width: 1200px;
  margin: 0 auto;
}

.sort-select,
.display-select {
  min-width: 200px;
  border-radius: 8px;
}

.sort-select :deep(.v-field),
.display-select :deep(.v-field) {
  border-radius: 8px !important;
  transition: all 0.2s ease;
}

.sort-select :deep(.v-field.v-field--focused),
.display-select :deep(.v-field.v-field--focused) {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.1);
}

.sort-select :deep(.v-field__input),
.display-select :deep(.v-field__input) {
  padding: 8px 12px;
}

.sort-select :deep(.v-select__selection),
.display-select :deep(.v-select__selection) {
  color: rgba(var(--v-theme-on-surface), 0.87);
  font-weight: 500;
}

.sort-select :deep(.v-list-item--active),
.display-select :deep(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.sort-select :deep(.v-list-item:hover),
.display-select :deep(.v-list-item:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}

/* モバイル対応 */
@media (max-width: 600px) {
  .manga-sort {
    padding: 12px !important;
  }

  .sort-select,
  .display-select {
    min-width: 100%;
  }

  .text-sm-end {
    text-align: left !important;
  }
}

/* タッチデバイス対応 */
@media (hover: none) {
  .v-select :deep(.v-field__input) {
    min-height: 48px;
  }
}

/* アクセシビリティ対応 */
.v-select:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
</style>
