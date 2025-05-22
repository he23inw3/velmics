<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

const router = useRouter();
const display = useDisplay();

const drawer = ref(false);
const scrolled = ref(false);

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 30;
  });
}

const menuItems = [
  { title: 'ホーム', icon: 'fas fa-home', route: '/' },
  { title: 'お気に入り', icon: 'fas fa-heart', route: '/favorites' },
  { title: '閲覧履歴', icon: 'fas fa-history', route: '/history' }
];

const navigateTo = (route: string) => {
  router.push(route);
  drawer.value = false;
};
</script>

<template>
  <div>
    <v-app-bar
      :elevation="scrolled ? 4 : 0"
      :color="scrolled ? undefined : 'transparent'"
      class="app-header"
      :class="{ 'scrolled': scrolled }"
    >
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          class="d-flex d-md-none"
        ></v-app-bar-nav-icon>
        <div class="d-flex align-center">
          <v-icon 
            size="large" 
            color="primary" 
            class="mr-2"
          >
            fas fa-book-open
          </v-icon>
          <h1 
            class="text-h5 brand-logo"
            @click="navigateTo('/')"
            style="cursor: pointer;"
          >
            Velmics
          </h1>
        </div>
      </template>
      
      <template v-slot:default>
        <v-tabs
          v-if="!display.smAndDown.value"
          color="primary"
          align-tabs="center"
        >
          <v-tab
            v-for="item in menuItems"
            :key="item.title"
            @click="navigateTo(item.route)"
          >
            <v-icon start>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="left"
    >
      <v-list>
        <v-list-item
          :title="'ようこそ'"
          :subtitle="'マンガの世界へ'"
        ></v-list-item>
      </v-list>
      
      <v-divider></v-divider>
      
      <v-list nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="navigateTo(item.route)"
          rounded="lg"
          class="mb-1"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
.app-header {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.app-header.scrolled {
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface-rgb), 0.9) !important;
}
</style>