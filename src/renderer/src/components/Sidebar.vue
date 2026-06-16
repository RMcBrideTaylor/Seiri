<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MenuItem from './MenuItem.vue'

interface Directory {
  name: string
  path: string
  children: Directory[]
}

const directories = ref<Directory[]>([])

const listDirectories = (): void => {
   window.electron.ipcRenderer.invoke('action:listDirectories').then((res) => {
    directories.value = res
   })
}

onMounted(() => {
  listDirectories()
})
</script>

<template>
  <div class="w-1/5 rounded-2xl p-3 shadow-even dark:bg-flat-black-500">
    <MenuItem
      v-for="(directory, index) in directories"
      :key="index"
      :directory="directory"
      :depth="1"
    />
  </div>
</template>
