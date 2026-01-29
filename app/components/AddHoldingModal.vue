<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {{ editHolding ? "Edit Holding" : "Add New Holding" }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
              >Coin</label
            >
            <UInput
              v-model="searchQuery"
              placeholder="Search for a coin..."
              icon="i-heroicons-magnifying-glass"
              :disabled="!!editHolding"
              @input="handleSearch"
            />

            <div
              v-if="searchResults.length && !selectedCoin && !editHolding"
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
                <span class="ml-auto text-sm text-gray-400">{{
                  formatCurrency(coin.price)
                }}</span>
              </button>
            </div>

            <div
              v-if="selectedCoin || editHolding"
              class="mt-2 flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <img
                :src="selectedCoin?.image || editHolding?.coinImage"
                :alt="selectedCoin?.name || editHolding?.coinName"
                class="w-8 h-8 rounded-full"
              />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ selectedCoin?.name || editHolding?.coinName }}
                </p>
                <p class="text-xs text-gray-500 uppercase">
                  {{ selectedCoin?.symbol || editHolding?.coinSymbol }}
                </p>
              </div>
              <UButton
                v-if="!editHolding"
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
              class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
              >Amount</label
            >
            <UInput
              v-model.number="form.amount"
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
              >Buy Price (USD)</label
            >
            <UInput
              v-model.number="form.buyPrice"
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              required
            />
            <p v-if="selectedCoin" class="text-xs text-gray-500 mt-1">
              Current price: {{ formatCurrency(selectedCoin.price) }}
            </p>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
              >Buy Date</label
            >
            <UInput v-model="form.buyDate" type="date" required />
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
              {{ editHolding ? "Update" : "Add" }} Holding
            </UButton>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Holding, SimpleCoin } from "~/types";

const props = defineProps<{
  editHolding?: Holding | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [holding: Omit<Holding, "id">];
}>();

const isOpen = defineModel<boolean>("open", { default: false });

const { formatCurrency } = useFormatters();
const coinsStore = useCoinsStore();

const searchQuery = ref("");
const searchResults = ref<SimpleCoin[]>([]);
const selectedCoin = ref<SimpleCoin | null>(null);

const form = reactive<{
  amount: number;
  buyPrice: number;
  buyDate: string;
}>({
  amount: 0,
  buyPrice: 0,
  buyDate: new Date().toISOString().split("T")[0] ?? "",
});

const isValid = computed(() => {
  const hasCoin = selectedCoin.value || props.editHolding;
  return hasCoin && form.amount > 0 && form.buyPrice > 0 && form.buyDate;
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
  form.buyPrice = coin.price;
};

const clearSelection = () => {
  selectedCoin.value = null;
  searchQuery.value = "";
};

const handleSubmit = () => {
  const selected = selectedCoin.value;
  const editing = props.editHolding;

  if (selected) {
    emit("submit", {
      coinId: selected.id,
      coinName: selected.name,
      coinSymbol: selected.symbol,
      coinImage: selected.image,
      amount: form.amount,
      buyPrice: form.buyPrice,
      buyDate: form.buyDate,
    });
  } else if (editing) {
    emit("submit", {
      coinId: editing.coinId,
      coinName: editing.coinName,
      coinSymbol: editing.coinSymbol,
      coinImage: editing.coinImage,
      amount: form.amount,
      buyPrice: form.buyPrice,
      buyDate: form.buyDate,
    });
  } else {
    return;
  }

  close();
};

const close = () => {
  isOpen.value = false;
  emit("close");
};

watch(
  () => props.editHolding,
  (holding) => {
    if (holding) {
      form.amount = holding.amount;
      form.buyPrice = holding.buyPrice;
      form.buyDate = holding.buyDate;
    } else {
      form.amount = 0;
      form.buyPrice = 0;
      form.buyDate = new Date().toISOString().split("T")[0] ?? "";
      selectedCoin.value = null;
      searchQuery.value = "";
    }
  },
  { immediate: true },
);
</script>
