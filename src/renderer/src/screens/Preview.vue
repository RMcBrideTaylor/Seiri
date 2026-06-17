<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const file = ref<File | null>(null)
const showingMenu = ref(false)

const open = (): void => {
  window.electron.ipcRenderer.invoke('action:openFile', route.params.id).then((res) => {
    file.value = res
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
      <button class="p-1 dark:bg-flat-black-100 rounded-l-xl cursor-pointer" @click="toggleMenu">
        <span class="material-icons">menu</span>
      </button>
    </div>
    <Transition>
      <div
        v-if="showingMenu"
        class="absolute h-full right-0 px-3 dark:bg-flat-black-500/90 z-10 pt-16 w-96 flex flex-col gap-4"
      >
        <div>
            <label><b>File</b></label>
          <input
            :value="file.path.split('/').filter(Boolean).at(-1)"
            disabled
            class="w-full ml-4"
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
            placeholder="add tag"
            class="w-full dark:bg-flat-black-950 rounded-full p-2 text-center"
          />
        </div>
      </div>
    </Transition>

    <img :src="'smag://' + file.path" class="max-h-full mx-auto" />
  </div>
</template>
