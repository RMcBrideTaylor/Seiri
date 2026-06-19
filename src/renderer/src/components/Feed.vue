<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ImageCard from './ImageCard.vue'
import Loading from './Loading.vue'

const model = defineModel<File[]>({ default: [] })
const emit = defineEmits(['rate', 'open'])
const pageLength = ref(9)

interface File {
  id: number
  path: string
  hash: string
  indexed: Date
  rating: number
}

const rate = (rate): void => {
  var formattedRate = { id: rate.id, rating: rate.rating.target.value }
  emit('rate', formattedRate)
}

const open = (fileId): void => {
  emit('open', fileId)
}

const loadMoreContent = (): void => {
  pageLength.value = pageLength.value + 9
  console.log(pageLength.value)
  console.log(model.value.length)
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // If the anchor div is visible in the viewport, load data
      if (entry.isIntersecting) {
        loadMoreContent()
      }
    })
  },
  {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  }
)

onMounted(() => {
  const anchor = document.getElementById('loadAnchor')
  if (anchor) {
    observer.observe(anchor)
  }
})
</script>

<template>
  <div class="md:w-4/5 mx-auto overflow-y-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <template v-for="(file, index) in model" :key="index">
            <ImageCard
              v-if="index % 3 == 0 && index <= pageLength"
              :file="file"
              @rate="rate"
              @open="open"
            />
          </template>
        </TransitionGroup>
      </div>
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <template v-for="(file, index) in model" :key="index">
            <ImageCard
              v-if="index % 3 == 1 && index <= pageLength"
              :file="file"
              @rate="rate"
              @open="open"
            />
          </template>
        </TransitionGroup>
      </div>
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <template v-for="(file, index) in model" :key="index">
            <ImageCard
              v-if="index % 3 == 2 && index <= pageLength"
              :file="file"
              @rate="rate"
              @open="open"
            />
          </template>
        </TransitionGroup>
      </div>
      <div v-if="pageLength < model.length" id="loadAnchor" class="text-center col-span-3">
        <Loading />
      </div>
    </div>
  </div>
</template>
