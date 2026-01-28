<template>
  <div class="space-y-3">
    <div v-for="coin in coins" :key="coin.id">
      <CoinCard :coin="coin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SimpleCoin } from "~/types";

defineProps<{
  coins: SimpleCoin[];
}>();
</script>
