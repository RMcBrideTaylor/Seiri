<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['refresh', 'addFilter', 'removeFilter', 'search', 'collapse'])
const filter = ref('')
const filters = ref<string[]>([])
const search = ref('')

const addFilter = (): void => {
  emit('addFilter', filter.value)
  filters.value.push(filter.value)
  filter.value = ''
}

const removeFilter = (f): void => {
  emit('removeFilter', f)
  filters.value = filters.value.filter((i) => i !== f)
}
</script>

<template>
  <div class="flex-none flex flex-col justify-center content-center gap-4">
    <input
      v-model="search"
      placeholder="search"
      class="w-1/2 mx-auto text-center p-2 rounded-full dark:bg-flat-black-500 dark:hover:bg-flat-black-100 border border-flat-black-100 focus:outline focus:outline-red-500"
      @keydown.enter="$emit('search', search)"
    />
    <div class="flex flex-row">
      <div class="md:w-1/5">
        <button
          class="bg-red-500 hover:bg-red-600 text-white dark:bg-flat-black-500 dark:hover:bg-flat-black-100 cursor-pointer rounded-full p-2"
          @click="$emit('collapse')"
        >
          <span class="material-icons" style="vertical-align: middle">menu</span>
        </button>
      </div>
      <div class="w-3/5 flex flex-row justify-start gap-2">
        <input
          v-model="filter"
          placeholder="Filter"
          class="text-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-flat-black-500 dark:hover:bg-flat-black-100 focus:outline focus:outline-red-500"
          @keydown.enter="addFilter"
        />

        <button
          v-for="(f, i) in filters"
          :key="i"
          class="bg-red-500 cursor-pointer py-2 px-3 rounded-full text-white"
          @click="removeFilter(f)"
        >
          {{ f }}
        </button>
      </div>
      <div class="w-1/5 flex flex-row-reverse">
        <button
          class="bg-gray-100 hover:bg-gray-200 dark:bg-flat-black-500 dark:hover:bg-flat-black-100 cursor-pointer rounded-full p-2"
          @click="$emit('refresh')"
        >
          <span class="material-icons" style="vertical-align: middle">refresh</span>
        </button>
      </div>
    </div>
  </div>
</template>
