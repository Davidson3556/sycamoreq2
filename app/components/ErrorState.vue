<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div
      class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4"
    >
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-8 h-8 text-red-400"
      />
    </div>
    <h3 class="text-lg font-semibold text-white mb-2">{{ title }}</h3>
    <p class="text-gray-500 text-sm max-w-md mb-6">{{ message }}</p>
    <UButton
      v-if="showRetry"
      variant="outline"
      color="primary"
      icon="i-heroicons-arrow-path"
      @click="$emit('retry')"
    >
      Try Again
    </UButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  message?: string;
  showRetry?: boolean;
}>();

defineEmits<{
  retry: [];
}>();
</script>
