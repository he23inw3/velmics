<script setup lang="ts">
import { useHead } from '@unhead/vue';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

// Set metadata for SEO
useHead({
  title: 'Page Not Found | Manga Collection',
  meta: [
    {
      name: 'description',
      content: 'The page you are looking for does not exist.'
    }
  ]
});
</script>

<template>
  <div>
    <AppHeader />
    
    <v-main>
      <v-container class="d-flex flex-column align-center justify-center text-center py-16">
        <v-icon size="96" color="primary">fas fa-ghost</v-icon>
        <h1 class="text-h2 mt-6">404</h1>
        <h2 class="text-h4 mt-2">Page Not Found</h2>
        <p class="text-body-1 mt-4 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <v-btn 
          to="/" 
          color="primary" 
          size="large" 
          class="mt-8" 
          prepend-icon="fas fa-home"
        >
          Back to Home
        </v-btn>
      </v-container>
    </v-main>
    
    <AppFooter />
  </div>
</template>

<style scoped>
.max-w-md {
  max-width: 28rem;
}
</style>