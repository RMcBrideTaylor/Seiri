<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import Toolbar from '../components/Toolbar.vue'
import Feed from '../components/Feed.vue'
import Loading from '../components/Loading.vue'
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
const selections = ref<number[]>([])
const tag = ref<string>('')

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

const searchPath = (pathQuery): void => {
  if (pathQuery.path !== pathQuery.home) {
    searchString.value = pathQuery.path + '/'
  } else {
    searchString.value = pathQuery.path
  }
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

const batchTag = (): void => {
  window.electron.ipcRenderer
    .invoke('action:batchTag', { selected: JSON.stringify(selections.value), tag: tag.value })
    .then(() => {
      tag.value = ''
      selections.value = []
    })
}

const selected = (id): void => {
  if (selections.value.includes(id)) {
    selections.value = selections.value.filter((i) => i !== id)
  } else {
    selections.value.push(id)
  }
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
      <div class="flex flex-col gap-4 h-full" :class="{ 'md:w-1/5': showMenu }">
        <TransitionGroup>
          <div v-if="selections.length > 0" class="p-3">
            <input
              v-model="tag"
              placeholder="Batch Tag"
              class="w-full text-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-flat-black-500 dark:hover:bg-flat-black-100 focus:outline focus:outline-red-500 mt-2"
              @keydown.enter="batchTag"
            />
          </div>
          <Sidebar v-if="showMenu" @search-path="searchPath" />
        </TransitionGroup>
      </div>
      <div v-if="!filesLoading" class="md:w-4/5 mx-auto overflow-y-auto">
        <Feed
          v-model:feed="feed"
          v-model:selections="selections"
          @rate="rate"
          @open="open"
          @selected="selected"
        />
      </div>
      <Loading v-else />
    </div>
  </div>
</template>
