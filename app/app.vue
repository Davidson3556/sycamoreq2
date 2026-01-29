<template>
  <UApp>
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col transition-colors duration-300"
    >
      <AppNavbar />
      <main class="flex-1 pt-16">
        <NuxtPage />
      </main>
      <AppFooter />
    </div>
    <UNotifications />
    <LoadingScreen v-if="isLoading" />
  </UApp>
</template>

<script setup lang="ts">
const portfolioStore = usePortfolioStore();
const alertsStore = useAlertsStore();
const coinsStore = useCoinsStore();

const isLoading = computed(
  () => coinsStore.loading && coinsStore.coins.length === 0,
);

onMounted(() => {
  portfolioStore.loadFromStorage();
  alertsStore.loadFromStorage();
  alertsStore.requestNotificationPermission();
});
</script>
