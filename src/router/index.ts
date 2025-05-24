import { createRouter, createWebHistory } from 'vue-router';
import { useStorageStore } from '@/stores/storage';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        title: 'Velmics - Home'
      }
    },
    {
      path: '/manga/:id',
      name: 'manga-detail',
      component: () => import('@/pages/MangaDetailPage.vue'),
      props: true,
      meta: {
        title: 'Velmics - Manga Details'
      }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/pages/FavoritesPage.vue'),
      meta: {
        title: 'Velmics - Favorite Manga'
      }
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/pages/HistoryPage.vue'),
      meta: {
        title: 'Velmics - Recently Viewed Manga'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: {
        title: 'Velmics - Page Not Found'
      }
    }
  ],
  // @ts-ignore
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// @ts-ignore
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title}` : 'Velmics';
  
  if (to.name === 'manga-detail' && to.params.id) {
    const storageStore = useStorageStore();
    const mangaId = to.params.id as string;
    storageStore.addToHistory(mangaId);
  }
  
  next();
});

export default router;