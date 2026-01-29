<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Markets
          </h1>
          <p class="text-gray-500 mt-1">
            {{ coinsStore.coins.length }} cryptocurrencies
          </p>
        </div>

        <div class="w-full md:w-80">
          <UInput
            v-model="searchQuery"
            placeholder="Search coins..."
            icon="i-heroicons-magnifying-glass"
            @input="handleSearch"
          />
        </div>
      </div>

      <LoadingState
        v-if="coinsStore.loading && !coinsStore.coins.length"
        message="Loading market data..."
      />

      <ErrorState
        v-else-if="coinsStore.error"
        title="Failed to Load Markets"
        :message="coinsStore.error"
        show-retry
        @retry="fetchData"
      />

      <EmptyState
        v-else-if="!coinsStore.filteredCoins.length && searchQuery"
        icon="i-heroicons-magnifying-glass"
        title="No Results Found"
        :message="`No coins matching '${searchQuery}'`"
      >
        <template #action>
          <UButton variant="outline" color="neutral" @click="clearSearch">
            Clear Search
          </UButton>
        </template>
      </EmptyState>

      <div
        v-else
        class="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden transition-colors"
      >
        <div
          class="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-500 border-b border-gray-200 dark:border-white/5"
        >
          <div class="col-span-1">#</div>
          <div class="col-span-4">Name</div>
          <div class="col-span-2 text-right">Price</div>
          <div class="col-span-2 text-right">24h Change</div>
          <div class="col-span-2 text-right">Market Cap</div>
          <div class="col-span-1 text-right">7D</div>
        </div>

        <div class="divide-y divide-gray-200 dark:divide-white/5">
          <NuxtLink
            v-for="coin in coinsStore.filteredCoins"
            :key="coin.id"
            :to="`/coin/${coin.id}`"
            class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <div class="col-span-1 text-gray-500 text-sm">{{ coin.rank }}</div>

            <div class="col-span-6 md:col-span-4 flex items-center gap-3">
              <img
                :src="coin.image"
                :alt="coin.name"
                class="w-8 h-8 rounded-full"
              />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ coin.name }}
                </p>
                <p class="text-xs text-gray-500 uppercase">{{ coin.symbol }}</p>
              </div>
            </div>

            <div
              class="col-span-5 md:col-span-2 text-right font-medium text-gray-900 dark:text-white"
            >
              {{ formatCurrency(coin.price) }}
            </div>

            <div class="hidden md:block col-span-2 text-right">
              <span
                :class="
                  coin.change24h >= 0 ? 'text-emerald-500' : 'text-red-500'
                "
                class="font-medium"
              >
                {{ formatPercentage(coin.change24h) }}
              </span>
            </div>

            <div class="hidden md:block col-span-2 text-right text-gray-500">
              {{ formatCompactNumber(coin.marketCap) }}
            </div>

            <div class="hidden md:block col-span-1 h-8">
              <SparklineChart
                v-if="coin.sparkline && coin.sparkline.length > 0"
                :data="coin.sparkline"
                :positive="coin.change24h >= 0"
              />
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Markets - CryptoTrack",
  meta: [
    {
      name: "description",
      content: "Explore cryptocurrency prices, market caps, and 24h changes.",
    },
  ],
});

const coinsStore = useCoinsStore();
const { formatCurrency, formatPercentage, formatCompactNumber } =
  useFormatters();
const { startUpdates } = usePriceUpdates();

const searchQuery = ref("");

const handleSearch = () => {
  coinsStore.setSearchQuery(searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = "";
  coinsStore.setSearchQuery("");
};

const fetchData = async () => {
  await coinsStore.fetchCoins();
};

onMounted(async () => {
  if (!coinsStore.coins.length) {
    await fetchData();
  }
  startUpdates();
});
</script>
