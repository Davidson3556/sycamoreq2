<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LoadingState v-if="loading" message="Loading coin details..." />

      <ErrorState
        v-else-if="error"
        title="Failed to Load Coin"
        :message="error"
        show-retry
        @retry="fetchCoin"
      />

      <template v-else-if="coin">
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
        >
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/markets"
              class="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <UIcon
                name="i-heroicons-arrow-left"
                class="w-5 h-5 text-gray-400"
              />
            </NuxtLink>
            <img
              :src="coin.image?.large"
              :alt="coin.name"
              class="w-12 h-12 rounded-full"
            />
            <div>
              <h1 class="text-3xl font-bold text-white">{{ coin.name }}</h1>
              <p class="text-gray-500 uppercase">{{ coin.symbol }}</p>
            </div>
            <span
              class="px-2 py-1 bg-gray-800 rounded-lg text-sm text-gray-400"
            >
              Rank #{{ coin.market_cap_rank }}
            </span>
          </div>

          <div class="flex gap-3">
            <UButton
              color="primary"
              icon="i-heroicons-plus"
              @click="showAddHolding = true"
            >
              Add to Portfolio
            </UButton>
            <UButton
              variant="outline"
              color="neutral"
              icon="i-heroicons-bell"
              @click="showAddAlert = true"
            >
              Set Alert
            </UButton>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div
            class="md:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
          >
            <div class="flex items-end gap-4 mb-4">
              <p class="text-4xl font-bold text-white">
                {{ formatCurrency(coin.market_data?.current_price?.usd || 0) }}
              </p>
              <span
                :class="priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'"
                class="text-lg font-medium pb-1"
              >
                {{ formatPercentage(priceChange) }}
              </span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-xs text-gray-500">24h High</p>
                <p class="font-medium text-white">
                  {{ formatCurrency(coin.market_data?.high_24h?.usd || 0) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">24h Low</p>
                <p class="font-medium text-white">
                  {{ formatCurrency(coin.market_data?.low_24h?.usd || 0) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Market Cap</p>
                <p class="font-medium text-white">
                  {{
                    formatCompactNumber(coin.market_data?.market_cap?.usd || 0)
                  }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Volume (24h)</p>
                <p class="font-medium text-white">
                  {{
                    formatCompactNumber(
                      coin.market_data?.total_volume?.usd || 0,
                    )
                  }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
          >
            <h3 class="font-semibold text-white mb-4">Statistics</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-500">All-Time High</span>
                <span class="text-white">{{
                  formatCurrency(coin.market_data?.ath?.usd || 0)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">All-Time Low</span>
                <span class="text-white">{{
                  formatCurrency(coin.market_data?.atl?.usd || 0)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Circulating Supply</span>
                <span class="text-white">{{
                  formatCompactNumber(coin.market_data?.circulating_supply || 0)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Total Supply</span>
                <span class="text-white">
                  {{
                    coin.market_data?.total_supply
                      ? formatCompactNumber(coin.market_data.total_supply)
                      : "∞"
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <PriceChart :coin-id="coinId" />

        <div
          v-if="coin.description?.en"
          class="mt-8 bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
        >
          <h3 class="font-semibold text-white mb-4">About {{ coin.name }}</h3>
          <div
            class="text-gray-400 text-sm leading-relaxed prose prose-invert max-w-none"
            v-html="truncatedDescription"
          ></div>
          <button
            v-if="coin.description.en.length > 500"
            class="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
            @click="showFullDescription = !showFullDescription"
          >
            {{ showFullDescription ? "Show Less" : "Read More" }}
          </button>
        </div>
      </template>

      <AddHoldingModal
        v-model:open="showAddHolding"
        @submit="handleAddHolding"
      />

      <AlertForm v-model:open="showAddAlert" @submit="handleAddAlert" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Holding } from "~/types";

const route = useRoute();
const coinId = route.params.id as string;

useHead({
  title: () =>
    coin.value
      ? `${coin.value.name} - CryptoTrack`
      : "Coin Details - CryptoTrack",
});

const portfolioStore = usePortfolioStore();
const alertsStore = useAlertsStore();
const { formatCurrency, formatPercentage, formatCompactNumber } =
  useFormatters();

const coin = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const showAddHolding = ref(false);
const showAddAlert = ref(false);
const showFullDescription = ref(false);

const priceChange = computed(
  () => coin.value?.market_data?.price_change_percentage_24h || 0,
);

const truncatedDescription = computed(() => {
  if (!coin.value?.description?.en) return "";
  const desc = coin.value.description.en;
  if (showFullDescription.value || desc.length <= 500) return desc;
  return desc.substring(0, 500) + "...";
});

const fetchCoin = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await $fetch(`/api/coins/${coinId}`);
    coin.value = data;
  } catch (e: any) {
    error.value = e.message || "Failed to load coin details";
  } finally {
    loading.value = false;
  }
};

const handleAddHolding = (holding: Omit<Holding, "id">) => {
  portfolioStore.addHolding({
    ...holding,
    coinId: coin.value.id,
    coinName: coin.value.name,
    coinSymbol: coin.value.symbol,
    coinImage: coin.value.image.small,
    buyPrice: holding.buyPrice || coin.value.market_data.current_price.usd,
  });
};

const handleAddAlert = (alert: any) => {
  alertsStore.addAlert({
    ...alert,
    coinId: coin.value.id,
    coinName: coin.value.name,
    coinSymbol: coin.value.symbol,
    coinImage: coin.value.image.small,
  });
};

onMounted(() => {
  fetchCoin();
});
</script>
