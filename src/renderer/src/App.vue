<script setup lang="ts">
import { ref } from 'vue'

var isLoaded = ref(false)
</script>

<template>
  <RouterView />
</template>

<style>
@reference "tailwindcss";

@theme {
  --color-flat-black-100: #272727;
  --color-flat-black-500: #1B1B1B;
  --color-flat-black-950: #181818;
  --shadow-even: 0 0 50px -12px rgb(0 0 0 / 0.25);
}

body {
  @apply dark:bg-flat-black-950;
  @apply dark:text-white;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>