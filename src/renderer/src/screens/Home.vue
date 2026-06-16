<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import Toolbar from '../components/Toolbar.vue'
import Feed from '../components/Feed.vue'
import { onMounted, ref } from 'vue'

enum ScreenState {
  loading,
  complete
}

interface File {
  id: number
  path: string
  hash: string
  indexed: Date
  rating: number
}

const files = ref<File[]>([])
const filesLoading = ref(true)
const showMenu = ref(true)

var state = ref(ScreenState.loading)

const reIndex = (): void => {
  window.electron.ipcRenderer.invoke('action:indexFiles').then(() => {
    state.value = ScreenState.complete
  })
}

onMounted(() => reIndex())

// Event Handlers
const filter = (filter): void => {

}

const search = (search): void => {
  
}

const refresh = (): void => {
  console.log('Refreshing...')
  listFiles()
}

const collapse = (): void => {
  showMenu.value = !showMenu.value
}

// IPC Calls
const listFiles = (): void => {
  window.electron.ipcRenderer.invoke('action:listFiles').then((res) => {
    files.value = res
    filesLoading.value = false
  })
}

onMounted(() => {
  listFiles()
})
</script>

<template>
  <div class="absolute bottom-0 top-0 left-0 right-0 p-8 flex flex-col gap-4">
    <Toolbar @collapse="collapse" @filter="filter" @refresh="refresh" @search="search" />
    <div class="grow flex flex-row overflow-hidden">
      <Transition>
      <Sidebar v-if="showMenu" />
      </Transition>
      <Feed v-model="files" />
    </div>
  </div>
</template>
