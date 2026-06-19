<script setup lang="ts"></script>

<template>
  <div class="flex flex-row justify-center gap-4">
    <div class="circle bg-red-500 dark:bg-white/90 animate-bounce"></div>
    <div class="circle bg-red-500 dark:bg-white/90 animate-bounce delay-300"></div>
    <div class="circle bg-red-500 dark:bg-white/90 animate-bounce delay-500"></div>
  </div>
</template>

<style>
.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>
