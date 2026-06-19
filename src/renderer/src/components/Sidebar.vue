<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MenuItem from './MenuItem.vue'

interface Directory {
  name: string
  path: string
  fullPath: string
  children: Directory[]
}

const emit = defineEmits(['searchPath'])

const directories = ref<Directory[]>([])

const listDirectories = (): void => {
  window.electron.ipcRenderer.invoke('action:listDirectories').then((res) => {
    directories.value = res
  })
}

const searchPath = (path): void => {
  emit('searchPath', path)
}

onMounted(() => {
  listDirectories()
})
</script>

<template>
  <div class="h-full rounded-2xl p-3 shadow-xl mb-4 dark:bg-flat-black-500 overflow-y-auto">
    <div class="pb-6">
      <MenuItem
        v-for="(directory, index) in directories"
        :key="index"
        :directory="directory"
        :depth="1"
        @search-path="searchPath"
      />
    </div>
  </div>
</template>
