<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
  >
    <div class="text-center">
      <div class="relative inline-block">
        <div
          class="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-emerald-500 dark:border-t-emerald-400 animate-spin"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-chart-bar-solid"
              class="w-5 h-5 text-gray-900"
            />
          </div>
        </div>
      </div>
      <p
        class="mt-6 text-lg font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
      >
        CryptoTrack
      </p>
      <p class="mt-2 text-sm text-gray-500">Loading market data...</p>
    </div>
  </div>
</template>
