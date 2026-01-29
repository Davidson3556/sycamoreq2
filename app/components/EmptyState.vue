<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div
      class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-4"
    >
      <UIcon :name="icon" class="w-8 h-8 text-gray-500" />
    </div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    <p class="text-gray-500 text-sm max-w-md mb-6">{{ message }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  title?: string;
  message?: string;
}>();
</script>
