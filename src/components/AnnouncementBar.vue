<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Announcement } from '@/types/manga';

const announcements = ref<Announcement[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const hiddenAnnouncements = ref<string[]>([]);

const fetchAnnouncements = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await fetch('/data/announcements.json');
    if (!response.ok) {
      throw new Error('お知らせの取得に失敗しました');
    }
    announcements.value = await response.json();
  } catch (err) {
    error.value = err instanceof Error ? err.message : '不明なエラーが発生しました';
    console.error('Error fetching announcements:', err);
  } finally {
    isLoading.value = false;
  }
};

const hideAnnouncement = (id: string) => {
  hiddenAnnouncements.value.push(id);
};

const visibleAnnouncements = computed(() => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  return announcements.value
    .filter(announcement => {
      const announcementDate = new Date(announcement.date);
      return announcementDate >= oneMonthAgo && !hiddenAnnouncements.value.includes(announcement.id);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

onMounted(() => {
  fetchAnnouncements();
});
</script>

<template>
  <div class="announcement-bar" v-if="visibleAnnouncements.length > 0 && !isLoading">
    <v-alert
      v-for="announcement in visibleAnnouncements"
      :key="announcement.id"
      :type="announcement.important ? 'warning' : 'info'"
      :variant="announcement.important ? 'elevated' : 'flat'"
      :title="announcement.title"
      :text="announcement.content"
      :prominent="announcement.important"
      class="mb-3"
      closable
      @click:close="hideAnnouncement(announcement.id)"
    >
      <template v-slot:prepend>
        <v-icon :icon="announcement.important ? 'fas fa-exclamation-circle' : 'fas fa-info-circle'"></v-icon>
      </template>
      <template v-slot:append>
        <div class="text-caption">{{ new Date(announcement.date).toLocaleDateString('ja-JP') }}</div>
      </template>
    </v-alert>
  </div>
</template>

<style scoped>
.announcement-bar {
  max-width: 1200px;
  margin: 0 auto 24px;
}
</style>
