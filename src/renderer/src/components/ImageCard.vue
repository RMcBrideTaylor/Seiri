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

defineEmits(['rate', 'open'])

const rightClick = (): void => {
    console.log("clicked")
}
</script>
<template>
  <button
    class="relative rounded-xl overflow-hidden transition delay-150 duration-300 ease-in-out hover:scale-105 hover:[&>div]:block cursor-pointer"
    @contextmenu.prevent="rightClick"
    @click="$emit('open', props.file.id)"
  >
    <div class="hidden absolute bottom-0 left-0 right-0 p-2 bg-black/30 text-white">
      <p>
        Rating:
        <button
          v-for="n in 5"
          :key="n"
          :value="n"
          class="cursor-pointer"
          @click="$emit('rate', { id: props.file.id, rating: $event })"
        >
          {{ props.file.rating >= n ? '⭐' : '★' }}
        </button>
      </p>
    </div>
    <img :src="'smag://' + props.file.path" />
  </button>
</template>
