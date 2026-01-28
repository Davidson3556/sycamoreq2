<template>
  <NuxtLink
    :to="`/coin/${coin.id}`"
    class="group block bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 hover:bg-gray-900/80 hover:border-emerald-500/20 transition-all duration-300"
  >
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-600 w-6 text-center">{{
          coin.rank
        }}</span>
        <img
          :src="coin.image"
          :alt="coin.name"
          class="w-10 h-10 rounded-full"
        />
      </div>

      <div class="flex-1 min-w-0">
        <h3
          class="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors"
        >
          {{ coin.name }}
        </h3>
        <p class="text-sm text-gray-500 uppercase">{{ coin.symbol }}</p>
      </div>

      <div
        v-if="coin.sparkline && coin.sparkline.length > 0"
        class="hidden sm:block w-24 h-10"
      >
        <SparklineChart
          :data="coin.sparkline"
          :positive="coin.change24h >= 0"
        />
      </div>

      <div class="text-right">
        <p class="font-semibold text-white">{{ formatCurrency(coin.price) }}</p>
        <p
          :class="change.class"
          class="text-sm font-medium flex items-center justify-end gap-1"
        >
          <UIcon :name="change.icon" class="w-3.5 h-3.5" />
          {{ change.text }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { SimpleCoin } from "~/types";

const props = defineProps<{
  coin: SimpleCoin;
}>();

const { formatCurrency, formatChange } = useFormatters();

const change = computed(() => formatChange(props.coin.change24h));
</script>
