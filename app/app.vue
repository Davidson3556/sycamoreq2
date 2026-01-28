<template>
  <UApp>
    <div class="min-h-screen bg-gray-950 text-white flex flex-col">
      <AppNavbar />
      <main class="flex-1 pt-16">
        <NuxtPage />
      </main>
      <AppFooter />
    </div>
    <UNotifications />
  </UApp>
</template>

<script setup lang="ts">
const portfolioStore = usePortfolioStore();
const alertsStore = useAlertsStore();

onMounted(() => {
  portfolioStore.loadFromStorage();
  alertsStore.loadFromStorage();
  alertsStore.requestNotificationPermission();
});
</script>
