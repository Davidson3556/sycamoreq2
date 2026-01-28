<template>
  <div
    class="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 hover:border-emerald-500/20 transition-all duration-300"
  >
    <div class="flex items-start gap-4">
      <img
        :src="holding.coinImage"
        :alt="holding.coinName"
        class="w-10 h-10 rounded-full"
      />

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-white">{{ holding.coinName }}</h3>
            <p class="text-sm text-gray-500 uppercase">
              {{ holding.coinSymbol }}
            </p>
          </div>

          <div class="flex gap-1">
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              icon="i-heroicons-pencil"
              @click="$emit('edit', holding)"
            />
            <UButton
              variant="ghost"
              color="error"
              size="xs"
              icon="i-heroicons-trash"
              @click="$emit('delete', holding.id)"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <p class="text-xs text-gray-500">Amount</p>
            <p class="font-medium text-white">
              {{ formatNumber(holding.amount) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Avg Buy Price</p>
            <p class="font-medium text-white">
              {{ formatCurrency(holding.buyPrice) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Current Value</p>
            <p class="font-medium text-white">
              {{ formatCurrency(holding.currentValue) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Profit/Loss</p>
            <p
              :class="isProfit ? 'text-emerald-400' : 'text-red-400'"
              class="font-medium"
            >
              {{ formatCurrency(holding.profitLoss) }}
              <span class="text-xs"
                >({{ formatPercentage(holding.profitLossPercentage) }})</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HoldingWithValue } from "~/types";

const props = defineProps<{
  holding: HoldingWithValue;
}>();

defineEmits<{
  edit: [holding: HoldingWithValue];
  delete: [id: string];
}>();

const { formatCurrency, formatNumber, formatPercentage } = useFormatters();

const isProfit = computed(() => props.holding.profitLoss >= 0);
</script>
