<template>
  <div
    class="bg-white/50 dark:bg-gradient-to-br dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 md:p-8 transition-colors duration-300"
  >
    <h2 class="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-6">
      Portfolio Value
    </h2>

    <div
      class="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
    >
      <div>
        <p
          class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight"
        >
          {{ formatCurrency(summary.totalValue) }}
        </p>
        <div class="flex items-center gap-3 mt-3">
          <span
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
              isProfit
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400',
            ]"
          >
            <UIcon
              :name="
                isProfit
                  ? 'i-heroicons-arrow-trending-up'
                  : 'i-heroicons-arrow-trending-down'
              "
              class="w-4 h-4"
            />
            {{ formatPercentage(summary.profitLossPercentage) }}
          </span>
          <span class="text-gray-500 text-sm">
            {{ isProfit ? "+" : ""
            }}{{ formatCurrency(summary.profitLoss) }} all time
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div
          class="bg-gray-100 dark:bg-gray-800/30 rounded-xl p-4 transition-colors"
        >
          <p class="text-xs text-gray-500 mb-1">Total Cost</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ formatCurrency(summary.totalCost) }}
          </p>
        </div>
        <div
          class="bg-gray-100 dark:bg-gray-800/30 rounded-xl p-4 transition-colors"
        >
          <p class="text-xs text-gray-500 mb-1">Holdings</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ holdingCount }} coins
          </p>
        </div>
      </div>
    </div>

    <div class="flex gap-3 mt-8">
      <UButton
        color="primary"
        icon="i-heroicons-plus"
        class="flex-1 justify-center"
        @click="$emit('add-holding')"
      >
        Add Holding
      </UButton>
      <UButton
        variant="outline"
        color="neutral"
        icon="i-heroicons-arrow-path"
        @click="$emit('refresh')"
      >
        Refresh
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PortfolioSummary } from "~/types";

const props = defineProps<{
  summary: PortfolioSummary;
  holdingCount: number;
}>();

defineEmits<{
  "add-holding": [];
  refresh: [];
}>();

const { formatCurrency, formatPercentage } = useFormatters();

const isProfit = computed(() => props.summary.profitLoss >= 0);
</script>
