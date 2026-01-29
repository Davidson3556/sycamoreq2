<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Portfolio
          </h1>
          <p class="text-gray-500 mt-1">Manage your cryptocurrency holdings</p>
        </div>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          @click="showAddModal = true"
        >
          Add Holding
        </UButton>
      </div>

      <PortfolioSummary
        v-if="portfolioStore.holdingCount > 0"
        :summary="portfolioStore.summary"
        :holding-count="portfolioStore.holdingCount"
        @add-holding="showAddModal = true"
        @refresh="handleRefresh"
        class="mb-8"
      />

      <template v-if="portfolioStore.holdingCount > 0">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Holdings
        </h2>
        <div class="space-y-4">
          <HoldingCard
            v-for="holding in portfolioStore.holdingsWithValues"
            :key="holding.id"
            :holding="holding"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-white/5">
          <UButton
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            @click="showClearConfirm = true"
          >
            Clear All Holdings
          </UButton>
        </div>
      </template>

      <EmptyState
        v-else
        icon="i-heroicons-wallet"
        title="No Holdings Yet"
        message="Start tracking your investments by adding your first cryptocurrency holding."
      >
        <template #action>
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            @click="showAddModal = true"
          >
            Add Your First Holding
          </UButton>
        </template>
      </EmptyState>

      <AddHoldingModal
        v-model:open="showAddModal"
        :edit-holding="editingHolding"
        @submit="handleSubmit"
        @close="editingHolding = null"
      />

      <UModal v-model:open="showClearConfirm">
        <template #content>
          <div class="p-6 text-center">
            <div
              class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"
            >
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-8 h-8 text-red-400"
              />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Clear All Holdings?
            </h3>
            <p class="text-gray-500 mb-6">
              This will permanently delete all your portfolio holdings. This
              action cannot be undone.
            </p>
            <div class="flex gap-3">
              <UButton
                variant="outline"
                color="neutral"
                class="flex-1"
                @click="showClearConfirm = false"
              >
                Cancel
              </UButton>
              <UButton color="error" class="flex-1" @click="handleClearAll">
                Clear All
              </UButton>
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Holding, HoldingWithValue } from "~/types";

useHead({
  title: "Portfolio - CryptoTrack",
  meta: [
    {
      name: "description",
      content: "Manage your cryptocurrency portfolio and track profit/loss.",
    },
  ],
});

const portfolioStore = usePortfolioStore();
const coinsStore = useCoinsStore();
const { startUpdates } = usePriceUpdates();

const showAddModal = ref(false);
const showClearConfirm = ref(false);
const editingHolding = ref<Holding | null>(null);

const handleRefresh = async () => {
  await coinsStore.fetchCoins();
};

const handleSubmit = (holding: Omit<Holding, "id">) => {
  if (editingHolding.value) {
    portfolioStore.updateHolding(editingHolding.value.id, holding);
    editingHolding.value = null;
  } else {
    portfolioStore.addHolding(holding);
  }
};

const handleEdit = (holding: HoldingWithValue) => {
  editingHolding.value = holding;
  showAddModal.value = true;
};

const handleDelete = (id: string) => {
  portfolioStore.removeHolding(id);
};

const handleClearAll = () => {
  portfolioStore.clearPortfolio();
  showClearConfirm.value = false;
};

onMounted(async () => {
  if (!coinsStore.coins.length) {
    await coinsStore.fetchCoins();
  }
  startUpdates();
});
</script>
