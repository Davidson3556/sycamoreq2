<template>
  <div class="min-h-screen">
    <section class="relative py-12 md:py-20 overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent"
      ></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PortfolioSummary
          v-if="portfolioStore.holdingCount > 0"
          :summary="portfolioStore.summary"
          :holding-count="portfolioStore.holdingCount"
          @add-holding="showAddModal = true"
          @refresh="handleRefresh"
        />

        <div
          v-else
          class="bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 text-center"
        >
          <div
            class="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-6"
          >
            <UIcon name="i-heroicons-wallet" class="w-8 h-8 text-gray-500" />
          </div>
          <h2 class="text-2xl font-bold text-white mb-3">
            Start Your Portfolio
          </h2>
          <p class="text-gray-500 mb-8 max-w-md mx-auto">
            Track your cryptocurrency investments, monitor real-time prices, and
            calculate your profit/loss.
          </p>
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            size="lg"
            @click="showAddModal = true"
          >
            Add Your First Holding
          </UButton>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-white">Market Overview</h2>
            <p class="text-gray-500 mt-1">Top cryptocurrencies by market cap</p>
          </div>
          <NuxtLink to="/markets">
            <UButton
              variant="ghost"
              color="neutral"
              trailing-icon="i-heroicons-arrow-right"
            >
              View All
            </UButton>
          </NuxtLink>
        </div>

        <LoadingState
          v-if="coinsStore.loading"
          message="Loading market data..."
        />

        <ErrorState
          v-else-if="coinsStore.error"
          title="Failed to Load"
          :message="coinsStore.error"
          show-retry
          @retry="fetchData"
        />

        <CoinList v-else :coins="topCoins" />
      </div>
    </section>

    <section class="py-12 bg-gray-900/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-white mb-8">Top Movers</h2>

        <div class="grid md:grid-cols-2 gap-8">
          <div
            class="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
          >
            <div class="flex items-center gap-2 mb-4">
              <UIcon
                name="i-heroicons-arrow-trending-up"
                class="w-5 h-5 text-emerald-400"
              />
              <h3 class="font-semibold text-white">Top Gainers</h3>
            </div>
            <div class="space-y-3">
              <NuxtLink
                v-for="coin in coinsStore.topGainers"
                :key="coin.id"
                :to="`/coin/${coin.id}`"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <img
                  :src="coin.image"
                  :alt="coin.name"
                  class="w-8 h-8 rounded-full"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium text-white">{{ coin.name }}</p>
                  <p class="text-xs text-gray-500 uppercase">
                    {{ coin.symbol }}
                  </p>
                </div>
                <span class="text-sm font-medium text-emerald-400">
                  {{ formatPercentage(coin.change24h) }}
                </span>
              </NuxtLink>
            </div>
          </div>

          <div
            class="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
          >
            <div class="flex items-center gap-2 mb-4">
              <UIcon
                name="i-heroicons-arrow-trending-down"
                class="w-5 h-5 text-red-400"
              />
              <h3 class="font-semibold text-white">Top Losers</h3>
            </div>
            <div class="space-y-3">
              <NuxtLink
                v-for="coin in coinsStore.topLosers"
                :key="coin.id"
                :to="`/coin/${coin.id}`"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <img
                  :src="coin.image"
                  :alt="coin.name"
                  class="w-8 h-8 rounded-full"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium text-white">{{ coin.name }}</p>
                  <p class="text-xs text-gray-500 uppercase">
                    {{ coin.symbol }}
                  </p>
                </div>
                <span class="text-sm font-medium text-red-400">
                  {{ formatPercentage(coin.change24h) }}
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AddHoldingModal v-model:open="showAddModal" @submit="handleAddHolding" />
  </div>
</template>

<script setup lang="ts">
import type { Holding } from "~/types";

useHead({
  title: "Dashboard - CryptoTrack",
  meta: [
    {
      name: "description",
      content:
        "Track your cryptocurrency portfolio with real-time prices and market data.",
    },
  ],
});

const coinsStore = useCoinsStore();
const portfolioStore = usePortfolioStore();
const { formatPercentage } = useFormatters();
const { startUpdates } = usePriceUpdates();

const showAddModal = ref(false);

const topCoins = computed(() => coinsStore.coins.slice(0, 10));

const fetchData = async () => {
  await coinsStore.fetchCoins();
};

const handleRefresh = async () => {
  await fetchData();
};

const handleAddHolding = (holding: Omit<Holding, "id">) => {
  portfolioStore.addHolding(holding);
};

onMounted(async () => {
  await fetchData();
  startUpdates();
});
</script>
