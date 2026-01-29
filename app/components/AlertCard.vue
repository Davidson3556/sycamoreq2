<template>
  <div
    :class="[
      'bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-4 transition-all duration-300',
      alert.isTriggered
        ? 'border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/5'
        : alert.isActive
          ? 'border-gray-200 dark:border-white/5 hover:border-emerald-500/20'
          : 'border-gray-200 dark:border-white/5 opacity-50',
    ]"
  >
    <div class="flex items-start gap-4">
      <img
        :src="alert.coinImage"
        :alt="alert.coinName"
        class="w-10 h-10 rounded-full"
      />

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ alert.coinName }}
          </h3>
          <span
            :class="[
              'text-xs px-2 py-0.5 rounded-full',
              alert.isTriggered
                ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                : alert.isActive
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gray-500/20 text-gray-500 dark:text-gray-400',
            ]"
          >
            {{ statusText }}
          </span>
        </div>

        <div class="flex items-center gap-2 mt-2">
          <UIcon
            :name="
              alert.direction === 'above'
                ? 'i-heroicons-arrow-trending-up'
                : 'i-heroicons-arrow-trending-down'
            "
            :class="
              alert.direction === 'above'
                ? 'text-emerald-500 dark:text-emerald-400'
                : 'text-red-500 dark:text-red-400'
            "
            class="w-4 h-4"
          />
          <span class="text-sm text-gray-600 dark:text-gray-400">
            Alert when price goes {{ alert.direction }}
          </span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
            formatCurrency(alert.targetPrice)
          }}</span>
        </div>

        <p class="text-xs text-gray-500 mt-2">
          Created {{ formatDate(alert.createdAt, "relative") }}
          <span v-if="alert.triggeredAt">
            • Triggered {{ formatDate(alert.triggeredAt, "relative") }}
          </span>
        </p>
      </div>

      <div class="flex gap-1">
        <UButton
          v-if="alert.isTriggered"
          variant="ghost"
          color="warning"
          size="xs"
          icon="i-heroicons-arrow-path"
          title="Reset alert"
          @click="$emit('reset', alert.id)"
        />
        <UButton
          variant="ghost"
          :color="alert.isActive ? 'neutral' : 'success'"
          size="xs"
          :icon="alert.isActive ? 'i-heroicons-pause' : 'i-heroicons-play'"
          :title="alert.isActive ? 'Pause alert' : 'Resume alert'"
          @click="$emit('toggle', alert.id)"
        />
        <UButton
          variant="ghost"
          color="error"
          size="xs"
          icon="i-heroicons-trash"
          title="Delete alert"
          @click="$emit('delete', alert.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PriceAlert } from "~/types";

const props = defineProps<{
  alert: PriceAlert;
}>();

defineEmits<{
  toggle: [id: string];
  delete: [id: string];
  reset: [id: string];
}>();

const { formatCurrency, formatDate } = useFormatters();

const statusText = computed(() => {
  if (props.alert.isTriggered) return "Triggered";
  if (props.alert.isActive) return "Active";
  return "Paused";
});
</script>
