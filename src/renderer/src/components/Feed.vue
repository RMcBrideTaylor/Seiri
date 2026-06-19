<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ImageCard from './ImageCard.vue'
import Loading from './Loading.vue'

const feed = defineModel<File[]>('feed', { default: [] })
const selections = defineModel<number[]>('selections', { default: [] })
const emit = defineEmits(['rate', 'open', 'selected'])
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

const selected = (id): void => {
  emit('selected', id)
}

const loadMoreContent = (): void => {
  pageLength.value = pageLength.value + 9
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
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <template v-for="(file, index) in feed" :key="index">
            <ImageCard
              v-if="index % 3 == 0 && index <= pageLength"
              v-model:selections="selections"
              :file="file"
              @rate="rate"
              @open="open"
              @selected="selected"
            />
          </template>
        </TransitionGroup>
      </div>
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <template v-for="(file, index) in feed" :key="index">
            <ImageCard
              v-if="index % 3 == 1 && index <= pageLength"
              v-model:selections="selections"
              :file="file"
              @rate="rate"
              @open="open"
              @selected="selected"
            />
          </template>
        </TransitionGroup>
      </div>
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <template v-for="(file, index) in feed" :key="index">
            <ImageCard
              v-if="index % 3 == 2 && index <= pageLength"
              v-model:selections="selections"
              :file="file"
              @rate="rate"
              @open="open"
              @selected="selected"
            />
          </template>
        </TransitionGroup>
      </div>
      <div v-if="pageLength < feed.length" id="loadAnchor" class="text-center col-span-3">
        <Loading />
      </div>
    </div>
  </div>
</template>
