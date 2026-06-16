<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Loading from '../components/Loading.vue'

enum ScreenState {
  creating,
  saving,
  loading
}

// State
var state = ref(ScreenState.creating)
var saveLocation = ref('')
var collectionName = ref('')
const router = useRouter()

// Functions
const openExisting = (): void => {
   window.electron.ipcRenderer.invoke('dialog:openCollection').then((res) => {
    router.push('/home')
   })
}
const createNew = (): void => {
  window.electron.ipcRenderer.invoke('dialog:createCollection').then((res) => {
    saveLocation.value = res
    state.value = ScreenState.saving
  })
}
const saveNew = (): void => {
  state.value = ScreenState.loading
  window.electron.ipcRenderer
    .invoke('dialog:saveCollection', [saveLocation.value, collectionName.value])
    .then((res) => {
      router.push('/home')
    })
}
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <div
      class="flex justify-center py-8 dark:bg-flat-black-500 w-lg h-1/2 rounded-3xl shadow-(--shadow-even)"
    >
      <div v-if="state == ScreenState.creating" class="flex flex-col gap-8 w-5/6">
        <div class="w-3/4 mx-auto">
          <button
            class="w-full text-white/60 px-4 py-3 text-center text-lg rounded-2xl cursor-pointer hover:dark:bg-flat-black-100"
            @click="openExisting"
          >
            <span class="material-icons" style="vertical-align: middle">assignment</span>
            Open an Existing Collection
          </button>
          <p class="text-center my-3">or</p>
          <button
            class="w-full text-white/60 px-4 py-3 text-center text-lg rounded-2xl cursor-pointer hover:dark:bg-flat-black-100"
            @click="createNew"
          >
            <span class="material-icons" style="vertical-align: middle">folder</span>
            Create a New One
          </button>
        </div>

        <div>
          <h2 class="text-sm text-white/60">Recents</h2>
          <div>No Projects Found.</div>
        </div>
      </div>

      <div
        v-else-if="state == ScreenState.saving"
        class="w-3/4 flex flex-col justify-center items-start gap-4"
      >
        <label class="hidden" for="collection_name">Collection Name</label>
        <input
          id="collection_name"
          v-model="collectionName"
          name="collection_name"
          placeholder="Collection Name"
          class="w-full text-center p-2 rounded-2xl dark:bg-flat-black-100 border dark:border-flat-black-100 focus:outline focus:outline-red-500"
          required
        />

        <label for="save_location">Location</label>
        <input
          id="save_location"
          v-model="saveLocation"
          name="save_location"
          class="w-full text-center p-2 rounded-2xl dark:bg-flat-black-500 border dark:border-flat-black-100"
          disabled
        />

        <div>
          <button
            class="p-2 px-4 rounded-full dark:bg-flat-black-100 cursor-pointer"
            @click="saveNew"
          >
            Save
          </button>
        </div>
      </div>

      <Loading v-else />
    </div>
  </div>
</template>
