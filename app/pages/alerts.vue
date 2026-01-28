<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 class="text-3xl font-bold text-white">Price Alerts</h1>
          <p class="text-gray-500 mt-1">
            Get notified when prices hit your targets
          </p>
        </div>
        <div class="flex gap-3">
          <UButton
            v-if="!notificationsEnabled"
            variant="outline"
            color="warning"
            icon="i-heroicons-bell-alert"
            @click="requestNotifications"
          >
            Enable Notifications
          </UButton>
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            @click="showAddModal = true"
          >
            Create Alert
          </UButton>
        </div>
      </div>

      <div
        v-if="alertsStore.alertCount > 0"
        class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div
          class="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-4"
        >
          <p class="text-xs text-gray-500 mb-1">Total Alerts</p>
          <p class="text-2xl font-bold text-white">
            {{ alertsStore.alertCount }}
          </p>
        </div>
        <div
          class="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-4"
        >
          <p class="text-xs text-gray-500 mb-1">Active</p>
          <p class="text-2xl font-bold text-emerald-400">
            {{ alertsStore.activeAlertCount }}
          </p>
        </div>
        <div
          class="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-4"
        >
          <p class="text-xs text-gray-500 mb-1">Triggered</p>
          <p class="text-2xl font-bold text-yellow-400">
            {{ alertsStore.triggeredAlerts.length }}
          </p>
        </div>
        <div
          class="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-4"
        >
          <p class="text-xs text-gray-500 mb-1">Notifications</p>
          <p
            class="text-2xl font-bold"
            :class="notificationsEnabled ? 'text-emerald-400' : 'text-gray-500'"
          >
            {{ notificationsEnabled ? "On" : "Off" }}
          </p>
        </div>
      </div>

      <template v-if="alertsStore.triggeredAlerts.length > 0">
        <h2
          class="text-xl font-semibold text-white mb-4 flex items-center gap-2"
        >
          <UIcon
            name="i-heroicons-bell-alert"
            class="w-5 h-5 text-yellow-400"
          />
          Triggered Alerts
        </h2>
        <div class="space-y-4 mb-8">
          <AlertCard
            v-for="alert in alertsStore.triggeredAlerts"
            :key="alert.id"
            :alert="alert"
            @toggle="alertsStore.toggleAlert"
            @delete="alertsStore.removeAlert"
            @reset="alertsStore.resetTriggeredAlert"
          />
        </div>
      </template>

      <template v-if="alertsStore.activeAlerts.length > 0">
        <h2 class="text-xl font-semibold text-white mb-4">Active Alerts</h2>
        <div class="space-y-4 mb-8">
          <AlertCard
            v-for="alert in alertsStore.activeAlerts"
            :key="alert.id"
            :alert="alert"
            @toggle="alertsStore.toggleAlert"
            @delete="alertsStore.removeAlert"
            @reset="alertsStore.resetTriggeredAlert"
          />
        </div>
      </template>

      <template v-if="pausedAlerts.length > 0">
        <h2 class="text-xl font-semibold text-gray-500 mb-4">Paused Alerts</h2>
        <div class="space-y-4">
          <AlertCard
            v-for="alert in pausedAlerts"
            :key="alert.id"
            :alert="alert"
            @toggle="alertsStore.toggleAlert"
            @delete="alertsStore.removeAlert"
            @reset="alertsStore.resetTriggeredAlert"
          />
        </div>
      </template>

      <EmptyState
        v-if="alertsStore.alertCount === 0"
        icon="i-heroicons-bell"
        title="No Alerts Yet"
        message="Create price alerts to get notified when your favorite coins reach your target prices."
      >
        <template #action>
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            @click="showAddModal = true"
          >
            Create Your First Alert
          </UButton>
        </template>
      </EmptyState>

      <div
        v-if="alertsStore.alertCount > 0"
        class="mt-8 pt-8 border-t border-white/5"
      >
        <UButton
          variant="ghost"
          color="error"
          icon="i-heroicons-trash"
          @click="alertsStore.clearAllAlerts"
        >
          Clear All Alerts
        </UButton>
      </div>

      <AlertForm v-model:open="showAddModal" @submit="handleAddAlert" />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Alerts - CryptoTrack",
  meta: [
    {
      name: "description",
      content: "Create and manage cryptocurrency price alerts.",
    },
  ],
});

const alertsStore = useAlertsStore();
const coinsStore = useCoinsStore();
const { startUpdates } = usePriceUpdates();

const showAddModal = ref(false);
const notificationsEnabled = ref(false);

const pausedAlerts = computed(() =>
  alertsStore.alerts.filter((a) => !a.isActive && !a.isTriggered),
);

const requestNotifications = async () => {
  notificationsEnabled.value =
    await alertsStore.requestNotificationPermission();
};

const handleAddAlert = (alert: any) => {
  alertsStore.addAlert(alert);
};

onMounted(async () => {
  if ("Notification" in window) {
    notificationsEnabled.value = Notification.permission === "granted";
  }

  if (!coinsStore.coins.length) {
    await coinsStore.fetchCoins();
  }

  startUpdates();
});
</script>
