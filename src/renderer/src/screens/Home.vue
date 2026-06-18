<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import Toolbar from '../components/Toolbar.vue'
import Feed from '../components/Feed.vue'
import { computed, onMounted, ref } from 'vue'

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
  tags: Tag[]
}

interface Tag {
  id: number
  name: string
}

const files = ref<File[]>([])
const filesLoading = ref(true)
const showMenu = ref(true)
const filters = ref<string[]>([])
const searchString = ref<string>('')

const state = ref(ScreenState.loading)

const reIndex = (): void => {
  window.electron.ipcRenderer.invoke('action:indexFiles').then(() => {
    state.value = ScreenState.complete
  })
}

onMounted(() => reIndex())

// Event Handlers
const addFilter = (filter): void => {
  filters.value.push(filter)
}

const removeFilter = (filter): void => {
  filters.value = filters.value.filter((i) => i != filter)
}

const search = (search): void => {
  searchString.value = search
}

const searchPath = (path): void => {
  searchString.value = path
}

const open = (fileId): void => {
  window.electron.ipcRenderer.send('action:openPreview', fileId)
}

const rate = (rate): void => {
  window.electron.ipcRenderer.invoke('action:rateFile', rate).then(() => {
    const id = files.value.findIndex((i) => i.id == rate.id)
    files.value[id].rating = rate.rating
  })
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
    files.value = res.toReversed()
    filesLoading.value = false
  })
}

const feed = computed(() => {
  var values = files.value
  if (filters.value.length > 0) {
    values = values.filter((i) =>
      i.tags.flatMap((m) => m.name).some((a) => filters.value.includes(a))
    )
  }

  if (searchString.value != '') {
    values = values.filter((s) => s.path.includes(searchString.value))
  }
  
  return values
})

onMounted(() => {
  listFiles()
})

window.electron.ipcRenderer.on('refresh', () => {
  refresh()
})
</script>

<template>
  <div class="absolute bottom-0 top-0 left-0 right-0 p-8 flex flex-col gap-4">
    <Toolbar
      @collapse="collapse"
      @add-filter="addFilter"
      @remove-filter="removeFilter"
      @refresh="refresh"
      @search="search"
    />
    <div class="grow flex flex-col md:flex-row overflow-hidden">
      <Transition>
        <Sidebar v-if="showMenu" @search-path="searchPath" />
      </Transition>
      <Feed v-model="feed" @rate="rate" @open="open" />
    </div>
  </div>
</template>
