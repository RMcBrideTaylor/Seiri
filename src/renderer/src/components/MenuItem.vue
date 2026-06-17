<script setup lang="ts">
interface Directory {
  name: string
  path: string
  children: Directory[]
}

const props = defineProps<{
  directory: Directory
  depth: number
}>()

</script>
<template>
  <button class="w-full p-2 hover:bg-gray-100 hover:dark:bg-flat-black-100 text-left rounded-xl">
    {{ props.directory.name }}
  </button>
  <div v-if="props.directory.children.length > 0" class="flex flex-row">
    <div class="bg-red-500 dark:bg-white/60 mx-2" style="width: 2px;"></div>
    <div v-if="props.depth < 4">
      <MenuItem
        v-for="(child, index) in props.directory.children"
        :key="index"
        :directory="child"
        :depth="props.depth + 1"
      />
    </div>
  </div>
</template>
