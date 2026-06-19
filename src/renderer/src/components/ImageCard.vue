<script setup lang="ts">
import { computed, ref } from 'vue'

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

const emit = defineEmits(['rate', 'open', 'selected'])

const selections = defineModel<number[]>('selections', { default: [] })

const selected = computed(() => {
  return selections.value.includes(props.file.id)
})

const rightClick = (): void => {
  console.log('clicked')
}

const clicked = (id): void => {
  emit('selected', id)
}
</script>
<template>
  <button
    class="relative rounded-xl overflow-hidden transition delay-150 duration-300 ease-in-out hover:scale-105 hover:[&>div]:block cursor-pointer"
    :class="{ 'outline-4 outline-red-500/60': selected }"
    @contextmenu.prevent="rightClick"
  >
    <div class="hidden absolute bottom-0 left-0 right-0 p-2 bg-black/30 text-white">
      <p>
        Rating:
        <button
          v-for="n in 5"
          :key="n"
          :value="n"
          class="cursor-pointer"
          @click.prevent="$emit('rate', { id: props.file.id, rating: $event })"
        >
          {{ props.file.rating >= n ? '⭐' : '★' }}
        </button>
      </p>
    </div>
    <img
      :src="'smag://' + props.file.path"
      @dblclick="$emit('open', props.file.id)"
      @click="clicked(props.file.id)"
    />
  </button>
</template>
