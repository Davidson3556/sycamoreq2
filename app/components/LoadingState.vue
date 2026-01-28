<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <div class="relative">
      <div
        class="w-16 h-16 rounded-full border-4 border-gray-800 border-t-emerald-400 animate-spin"
      ></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-emerald-400" />
      </div>
    </div>
    <p class="mt-4 text-gray-500 text-sm">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
