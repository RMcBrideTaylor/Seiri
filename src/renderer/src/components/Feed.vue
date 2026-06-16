<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ImageCard from './ImageCard.vue'

const model = defineModel<File[]>({ default: [] })

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
</script>

<template>
  <div class="w-4/5 mx-auto overflow-y-auto">
    <div class="grid grid-cols-3 gap-4 overflow-y-scroll p-6">
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <div v-for="(file, index) in collection1" :key="index">
            <ImageCard :file="file" />
          </div>
        </TransitionGroup>
      </div>
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <div v-for="(file, index) in collection2" :key="index">
            <ImageCard :file="file" />
          </div>
        </TransitionGroup>
      </div>
      <div>
        <TransitionGroup name="collection1" tag="div" class="flex flex-col gap-4">
          <div v-for="(file, index) in collection3" :key="index">
            <ImageCard :file="file" />
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>
