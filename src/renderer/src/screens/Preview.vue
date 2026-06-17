<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

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

const route = useRoute()

const file = ref<File | null>(null)
const showingMenu = ref(false)
const newTag = ref('')

const open = (): void => {
  window.electron.ipcRenderer.invoke('action:openFile', route.params.id).then((res) => {
    file.value = res
  })
}

const addTag = (): void => {
  window.electron.ipcRenderer
    .invoke('action:addTag', { id: route.params.id, tag: newTag.value })
    .then((res) => {
      if (!file.value) {
        return
      }

      file.value.tags = res
      newTag.value = ''
    })
}

const toggleMenu = (): void => {
  showingMenu.value = !showingMenu.value
}

const rate = (rate): void => {
  const payload = {
    ...rate,
    rating: rate.rating.target.value
  }

  window.electron.ipcRenderer.invoke('action:rateFile', payload).then((res) => {
    if (file.value != null) {
      file.value.rating = payload.rating
    }
  })
}

onMounted(() => {
  open()
})
</script>
<template>
  <div v-if="file" class="w-full h-screen overflow-hidden static bg-black">
    <div class="absolute w-full top-0 flex flex-row-reverse py-3 z-50">
      <button
        :class="{ 'bg-red-500': showingMenu, 'dark:bg-flat-black-100': !showingMenu }"
        class="p-1 rounded-l-xl cursor-pointer"
        @click="toggleMenu"
      >
        <span class="material-icons">menu</span>
      </button>
    </div>
    <Transition>
      <div
        v-if="showingMenu"
        class="absolute right-4 top-4 bottom-4 px-6 dark:bg-flat-black-500/70 z-10 pt-16 w-96 flex flex-col gap-4 rounded-3xl"
      >
        <div>
          <label class="mb-4"><b>File</b></label>
          <input
            :value="file.path.split('/').filter(Boolean).at(-1)"
            disabled
            class="w-full dark:bg-flat-black-500 rounded-2xl p-2 text-center"
          />
        </div>
        <div>
          <label><b>Rating: </b></label>
          <button
            v-for="n in 5"
            :key="n"
            :value="n"
            class="cursor-pointer text-xl"
            @click="rate({ id: file.id, rating: $event })"
          >
            {{ file.rating >= n ? '⭐' : '★' }}
          </button>
        </div>
        <div>
          <input
            v-model="newTag"
            placeholder="add tag"
            class="w-full dark:bg-flat-black-100 rounded-2xl p-2 text-center focus:outline focus:outline-red-500"
            @keydown.enter="addTag"
          />
          <div class="flex flex-row my-4">
            <button v-for="(tag, index) in file.tags" :key="index" class="bg-red-500 rounded-2xl py-2 px-3">
                {{ tag.name }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <img :src="'smag://' + file.path" class="max-h-full mx-auto" />
  </div>
</template>
