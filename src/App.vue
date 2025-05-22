<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useUIStore } from './stores/ui';

const uiStore = useUIStore();

// Apply dark mode class based on user settings
onMounted(() => {
  document.documentElement.classList.toggle('dark-theme', uiStore.uiSettings.darkMode);
});

// Watch for changes to dark mode setting
watch(() => uiStore.uiSettings.darkMode, (isDark) => {
  document.documentElement.classList.toggle('dark-theme', isDark);
});
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style>
/* Global styles */
html, body {
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.dark-theme {
  --v-theme-surface: #1E1E1E;
  --v-theme-background: #121212;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

/* Allow line clamping for text overflow */
.line-clamp-1,
.line-clamp-2,
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  -webkit-line-clamp: 3;
}
</style>