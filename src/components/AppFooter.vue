<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <v-footer class="bg-primary">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center text-white">
          <p class="mb-0">
            &copy; {{ currentYear }} Velmics. All rights reserved.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>