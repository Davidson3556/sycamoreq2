<template>
  <div
    class="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
  >
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-white">Price Chart</h3>
      <div class="flex gap-1 bg-gray-800/50 rounded-lg p-1">
        <button
          v-for="range in timeRanges"
          :key="range"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
            selectedRange === range
              ? 'bg-emerald-500 text-white'
              : 'text-gray-400 hover:text-white',
          ]"
          @click="selectRange(range)"
        >
          {{ range }}
        </button>
      </div>
    </div>

    <div class="relative h-64 md:h-80">
      <LoadingState v-if="loading" message="Loading chart data..." />
      <ErrorState
        v-else-if="error"
        title="Chart Error"
        :message="error"
        show-retry
        @retry="fetchData"
      />
      <canvas v-else ref="canvasRef"></canvas>
    </div>

    <div
      v-if="!loading && !error && chartData.length"
      class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      <div class="bg-gray-800/30 rounded-xl p-3">
        <p class="text-xs text-gray-500 mb-1">High</p>
        <p class="font-semibold text-white">{{ formatCurrency(stats.high) }}</p>
      </div>
      <div class="bg-gray-800/30 rounded-xl p-3">
        <p class="text-xs text-gray-500 mb-1">Low</p>
        <p class="font-semibold text-white">{{ formatCurrency(stats.low) }}</p>
      </div>
      <div class="bg-gray-800/30 rounded-xl p-3">
        <p class="text-xs text-gray-500 mb-1">Average</p>
        <p class="font-semibold text-white">{{ formatCurrency(stats.avg) }}</p>
      </div>
      <div class="bg-gray-800/30 rounded-xl p-3">
        <p class="text-xs text-gray-500 mb-1">Change</p>
        <p :class="changeColor" class="font-semibold">
          {{ formatPercentage(stats.change) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
} from "chart.js";
import type { TimeRange } from "~/types";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
);

const props = defineProps<{
  coinId: string;
}>();

const { formatCurrency, formatPercentage } = useFormatters();

const timeRanges: TimeRange[] = ["1D", "7D", "1M", "3M", "1Y", "ALL"];
const selectedRange = ref<TimeRange>("7D");
const loading = ref(false);
const error = ref<string | null>(null);
const chartData = ref<{ timestamp: number; price: number }[]>([]);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const stats = computed(() => {
  if (!chartData.value.length) return { high: 0, low: 0, avg: 0, change: 0 };

  const prices = chartData.value.map((d) => d.price);
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const first = prices[0] ?? 0;
  const last = prices[prices.length - 1] ?? 0;
  const change = first > 0 ? ((last - first) / first) * 100 : 0;

  return { high, low, avg, change };
});

const changeColor = computed(() =>
  stats.value.change >= 0 ? "text-emerald-400" : "text-red-400",
);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await $fetch<{ prices: [number, number][] }>(
      `/api/coins/${props.coinId}/history`,
      {
        query: { range: selectedRange.value },
      },
    );

    chartData.value = data.prices.map(([timestamp, price]) => ({
      timestamp,
      price,
    }));
    await nextTick();
    createChart();
  } catch (e: any) {
    error.value = e.message || "Failed to load chart data";
  } finally {
    loading.value = false;
  }
};

const selectRange = (range: TimeRange) => {
  selectedRange.value = range;
  fetchData();
};

const createChart = () => {
  if (!canvasRef.value || !chartData.value.length) return;

  if (chart) {
    chart.destroy();
  }

  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  const isPositive = stats.value.change >= 0;
  const color = isPositive ? "#10b981" : "#ef4444";
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(
    0,
    isPositive ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
  );
  gradient.addColorStop(1, "transparent");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.value.map((d) =>
        new Date(d.timestamp).toLocaleDateString(),
      ),
      datasets: [
        {
          data: chartData.value.map((d) => d.price),
          borderColor: color,
          borderWidth: 2,
          fill: true,
          backgroundColor: gradient,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          titleColor: "#94a3b8",
          bodyColor: "#fff",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: (items) => {
              const item = items[0];
              if (!item) return "";
              const dataPoint = chartData.value[item.dataIndex];
              if (!dataPoint) return "";
              return new Date(dataPoint.timestamp).toLocaleString();
            },
            label: (item) => `$${Number(item.raw).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: true,
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
          },
          ticks: {
            color: "#6b7280",
            callback: (value) => `$${Number(value).toLocaleString()}`,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  });
};

watch(
  () => props.coinId,
  () => {
    fetchData();
  },
);

onMounted(() => {
  fetchData();
});

onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>
