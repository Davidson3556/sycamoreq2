<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-950"
  >
    <div class="text-center">
      <div class="relative w-20 h-20 mx-auto mb-6">
        <div
          class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800"
        ></div>
        <div
          class="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"
        ></div>

        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-chart-bar-solid"
              class="w-5 h-5 text-white"
            />
          </div>
        </div>
      </div>

      <p
        class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
      >
        CryptoTrack
      </p>
      <p class="mt-2 text-sm text-gray-500">Loading market data...</p>
    </div>
  </div>
</template>
