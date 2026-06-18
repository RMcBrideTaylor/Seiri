<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as ExifReader from 'exifreader'

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
const data = ref()

const open = (): void => {
  window.electron.ipcRenderer
    .invoke('action:openFile', route.params.id)
    .then((res) => {
      file.value = res
    })
    .finally(() => {
      loadMeta()
    })
}

const loadMeta = async (): Promise<void> => {
  if (file.value) {
    window.electron.ipcRenderer.invoke('action:readFile', file.value.path).then(async (res) => {
      if (res) {
        const properties = ['Artist', 'Make', 'Model', 'Lens', 'DateCreated']
        const exif = await ExifReader.load(res.buffer)

        var mapped = {}

        properties.forEach((p) => {
          if (exif[p]) {
            if (typeof exif[p].value === 'object') {
              mapped[p] = exif[p].value[0]
            } else {
              mapped[p] = exif[p].value
            }
          }
        })

        data.value = mapped
      }
    })
  }
}

const refreshMain = (): void => {
  window.electron.ipcRenderer.send('action:refresh')
}

const addTag = (): void => {
  window.electron.ipcRenderer
    .invoke('action:addTag', { id: route.params.id, tag: newTag.value })
    .then((res) => {
      if (!file.value) {
        return
      }

      file.value.tags.push(res)
      newTag.value = ''

      refreshMain()
    })
}

const removeTag = (id): void => {
  window.electron.ipcRenderer
    .invoke('action:removeTag', { id: route.params.id, tagId: id })
    .then(() => {
      if (!file.value) {
        return
      }

      file.value.tags = file.value.tags.filter((t) => t.id !== id)
      refreshMain()
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

  window.electron.ipcRenderer.invoke('action:rateFile', payload).then(() => {
    if (file.value != null) {
      file.value.rating = payload.rating
    }

    refreshMain()
  })
}

onMounted(() => {
  open()
})
</script>
<template>
  <div v-if="file" class="w-full h-screen overflow-hidden static bg-black text-white">
    <div class="absolute w-full top-0 flex flex-row-reverse py-3 z-50">
      <button
        :class="{ 'bg-red-500': showingMenu, 'bg-flat-black-100': !showingMenu }"
        class="p-1 rounded-l-xl cursor-pointer"
        @click="toggleMenu"
      >
        <span class="material-icons">menu</span>
      </button>
    </div>
    <Transition>
      <div
        v-if="showingMenu"
        class="absolute right-4 top-4 bottom-4 px-6 bg-flat-black-500/70 z-10 pt-16 w-96 flex flex-col gap-4 rounded-3xl"
      >
        <div>
          <label class="mb-4"><b>File</b></label>
          <input
            :value="file.path.split('/').filter(Boolean).at(-1)"
            disabled
            class="w-full bg-flat-black-500 rounded-2xl p-2 text-center"
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
            class="w-full bg-flat-black-500 hover:bg-flat-black-100 hover:scale-105 rounded-2xl p-2 text-center focus:outline focus:outline-red-500"
            @keydown.enter="addTag"
          />
          <TransitionGroup tag="button" class="flex flex-row my-4 gap-2">
            <button
              v-for="(tag, index) in file.tags"
              :key="index"
              class="bg-red-500 rounded-2xl py-2 px-3"
              @click="removeTag(tag.id)"
            >
              {{ tag.name }}
              <span class="material-icons" style="vertical-align: bottom">close</span>
            </button>
          </TransitionGroup>
        </div>
        <div v-if="data">
          <p v-for="(dataPoint, index) in data" :key="index"><b>{{ index }}:</b> {{ dataPoint }}</p>
        </div>
      </div>
    </Transition>

    <img :src="'smag://' + file.path" class="max-h-full mx-auto my-auto" />
  </div>
</template>
