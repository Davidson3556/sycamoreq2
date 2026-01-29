<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Create Price Alert
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label
              class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
              >Coin</label
            >
            <UInput
              v-model="searchQuery"
              placeholder="Search for a coin..."
              icon="i-heroicons-magnifying-glass"
              @input="handleSearch"
            />

            <div
              v-if="searchResults.length && !selectedCoin"
              class="mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-white/10 max-h-48 overflow-y-auto"
            >
              <button
                v-for="coin in searchResults"
                :key="coin.id"
                type="button"
                class="w-full flex items-center gap-3 p-3 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                @click="selectCoin(coin)"
              >
                <img
                  :src="coin.image"
                  :alt="coin.name"
                  class="w-8 h-8 rounded-full"
                />
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ coin.name }}
                  </p>
                  <p class="text-xs text-gray-500 uppercase">
                    {{ coin.symbol }}
                  </p>
                </div>
                <span
                  class="ml-auto text-sm text-gray-600 dark:text-gray-400"
                  >{{ formatCurrency(coin.price) }}</span
                >
              </button>
            </div>

            <div
              v-if="selectedCoin"
              class="mt-2 flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <img
                :src="selectedCoin.image"
                :alt="selectedCoin.name"
                class="w-8 h-8 rounded-full"
              />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ selectedCoin.name }}
                </p>
                <p class="text-xs text-gray-500">
                  Current: {{ formatCurrency(selectedCoin.price) }}
                </p>
              </div>
              <UButton
                variant="ghost"
                color="neutral"
                size="xs"
                icon="i-heroicons-x-mark"
                class="ml-auto"
                @click="clearSelection"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
              >Alert When Price Goes</label
            >
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                :class="[
                  'flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200',
                  form.direction === 'above'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                    : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                ]"
                @click="form.direction = 'above'"
              >
                <UIcon name="i-heroicons-arrow-trending-up" class="w-5 h-5" />
                <span class="font-medium">Above</span>
              </button>
              <button
                type="button"
                :class="[
                  'flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200',
                  form.direction === 'below'
                    ? 'bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                ]"
                @click="form.direction = 'below'"
              >
                <UIcon name="i-heroicons-arrow-trending-down" class="w-5 h-5" />
                <span class="font-medium">Below</span>
              </button>
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
              >Target Price (USD)</label
            >
            <UInput
              v-model.number="form.targetPrice"
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              required
            />
            <p
              v-if="selectedCoin && form.targetPrice"
              class="text-xs text-gray-500 mt-1"
            >
              {{ priceDifference }}
            </p>
          </div>

          <div class="flex gap-3 pt-4">
            <UButton
              type="button"
              variant="outline"
              color="neutral"
              class="flex-1"
              @click="close"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              class="flex-1"
              :disabled="!isValid"
            >
              Create Alert
            </UButton>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { SimpleCoin } from "~/types";

const emit = defineEmits<{
  close: [];
  submit: [
    alert: {
      coinId: string;
      coinName: string;
      coinSymbol: string;
      coinImage: string;
      targetPrice: number;
      direction: "above" | "below";
      isActive: boolean;
    },
  ];
}>();

const isOpen = defineModel<boolean>("open", { default: false });

const { formatCurrency, formatPercentage } = useFormatters();
const coinsStore = useCoinsStore();

const searchQuery = ref("");
const searchResults = ref<SimpleCoin[]>([]);
const selectedCoin = ref<SimpleCoin | null>(null);

const form = reactive({
  direction: "above" as "above" | "below",
  targetPrice: 0,
});

const isValid = computed(() => {
  return selectedCoin.value && form.targetPrice > 0;
});

const priceDifference = computed(() => {
  if (!selectedCoin.value || !form.targetPrice) return "";
  const diff =
    ((form.targetPrice - selectedCoin.value.price) / selectedCoin.value.price) *
    100;
  const direction = diff >= 0 ? "higher" : "lower";
  return `${Math.abs(diff).toFixed(2)}% ${direction} than current price`;
});

const handleSearch = () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();
  searchResults.value = coinsStore.coins
    .filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.symbol.toLowerCase().includes(query),
    )
    .slice(0, 5);
};

const selectCoin = (coin: SimpleCoin) => {
  selectedCoin.value = coin;
  searchQuery.value = coin.name;
  searchResults.value = [];
  form.targetPrice = coin.price;
};

const clearSelection = () => {
  selectedCoin.value = null;
  searchQuery.value = "";
};

const handleSubmit = () => {
  if (!selectedCoin.value) return;

  emit("submit", {
    coinId: selectedCoin.value.id,
    coinName: selectedCoin.value.name,
    coinSymbol: selectedCoin.value.symbol,
    coinImage: selectedCoin.value.image,
    targetPrice: form.targetPrice,
    direction: form.direction,
    isActive: true,
  });

  close();
};

const close = () => {
  isOpen.value = false;
  form.direction = "above";
  form.targetPrice = 0;
  selectedCoin.value = null;
  searchQuery.value = "";
  emit("close");
};
</script>
