<script setup lang="ts">
interface File {
  id: number
  path: string
  hash: string
  indexed: Date
  rating: number
}

const props = defineProps<{
  file: File
}>()

defineEmits(['rate'])
</script>
<template>
  <button
    class="relative rounded-xl overflow-hidden transition delay-150 duration-300 ease-in-out hover:scale-105 hover:[&>div]:block cursor-pointer"
  >
    <div class="hidden absolute bottom-0 left-0 right-0 p-2 bg-black/30">
      <p>
        Rating:
        <button
          v-for="n in props.file.rating"
          :key="n"
          class="cursor-pointer"
          @click="$emit('rate')"
        >
          ⭐
        </button>
        <button
          v-for="n in 5 - props.file.rating"
          :key="n"
          class="cursor-pointer"
          @click="$emit('rate')"
        >
          ★
        </button>
      </p>
    </div>
    <img :src="'smag://' + props.file.path" />
  </button>
</template>
