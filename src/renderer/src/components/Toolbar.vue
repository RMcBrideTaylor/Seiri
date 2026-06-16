<script setup lang="ts">
import { ref } from 'vue';

defineEmits(['refresh', 'filter', 'search', 'collapse'])
const filter = ref('')
const search = ref('')
</script>

<template>
  <div class="flex-none flex flex-col justify-center content-center gap-4">
    <input
      v-model="search"
      placeholder="search"
      class="md:w-1/2 mx-auto text-center p-2 rounded-full dark:bg-flat-black-500 dark:hover:bg-flat-black-100 border border-flat-black-100 focus:outline focus:outline-red-500"
      @keydown.enter="$emit('search', search)"
    />
    <div class="flex flex-row">
      <div class="md:w-1/5">
        <button
          class="dark:bg-flat-black-500 dark:hover:bg-flat-black-100 cursor-pointer rounded-full p-2"
          @click="$emit('collapse')"
        >
          <span class="material-icons" style="vertical-align: middle">menu</span>
        </button>
      </div>
      <div class="md:w-3/5">
        <input
          v-model="filter"
          placeholder="Filter"
          class="mx-auto text-center p-2 rounded-full dark:bg-flat-black-500 dark:hover:bg-flat-black-100 focus:outline focus:outline-red-500"
          @keydown.enter="$emit('filter', filter)"
        />
      </div>
      <div class="md:w-1/5 flex flex-row-reverse">
        <button
          class="dark:bg-flat-black-500 dark:hover:bg-flat-black-100 cursor-pointer rounded-full p-2"
          @click="$emit('refresh')"
        >
          <span class="material-icons" style="vertical-align: middle">refresh</span>
        </button>
      </div>
    </div>
  </div>
</template>
