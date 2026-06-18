<script setup lang="ts">
import { computed } from 'vue'
import ImageCard from './ImageCard.vue'

const model = defineModel<File[]>({ default: [] })
const emit = defineEmits(['rate', 'open'])

interface File {
  id: number
  path: string
  hash: string
  indexed: Date
  rating: number
}

const collection1 = computed(() => {
  return model.value.filter((_n, i) => i % 3 == 0)
})
const collection2 = computed(() => {
  return model.value.filter((_n, i) => i % 3 == 1)
})
const collection3 = computed(() => {
  return model.value.filter((_n, i) => i % 3 == 2)
})

const rate = (rate): void => {
  var formattedRate = { id: rate.id, rating: rate.rating.target.value }
  emit('rate', formattedRate)
}

const open = (fileId): void => {
  emit('open', fileId)
}
</script>

<template>
  <div class="md:w-4/5 mx-auto overflow-y-auto">

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-scroll p-6">
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <div v-for="(file, index) in collection1" :key="index">
            <ImageCard :file="file" @rate="rate" @open="open" />
          </div>
        </TransitionGroup>
      </div>
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <div v-for="(file, index) in collection2" :key="index">
            <ImageCard :file="file" @rate="rate" @open="open"/>
          </div>
        </TransitionGroup>
      </div>
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <div v-for="(file, index) in collection3" :key="index">
            <ImageCard :file="file" @rate="rate" @open="open"/>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>
