<template>
  <div
    class="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-white/5 rounded-2xl p-6 transition-colors duration-300"
  >
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Price Chart
      </h3>
      <div class="flex gap-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
        <button
          v-for="range in timeRanges"
          :key="range"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
            selectedRange === range
              ? 'bg-emerald-500 text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800',
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
      <EmptyState
        v-else-if="!chartData.length"
        message="No price data available for this range"
      />
      <div v-else class="w-full h-full">
        <canvas ref="canvasRef" class="w-full h-full"></canvas>
      </div>
    </div>

    <div
      v-if="!loading && !error && chartData.length"
      class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      <div
        class="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-3 transition-colors"
      >
        <p class="text-xs text-gray-500 mb-1">High</p>
        <p class="font-semibold text-gray-900 dark:text-white">
          {{ formatCurrency(stats.high) }}
        </p>
      </div>
      <div
        class="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-3 transition-colors"
      >
        <p class="text-xs text-gray-500 mb-1">Low</p>
        <p class="font-semibold text-gray-900 dark:text-white">
          {{ formatCurrency(stats.low) }}
        </p>
      </div>
      <div
        class="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-3 transition-colors"
      >
        <p class="text-xs text-gray-500 mb-1">Average</p>
        <p class="font-semibold text-gray-900 dark:text-white">
          {{ formatCurrency(stats.avg) }}
        </p>
      </div>
      <div
        class="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-3 transition-colors"
      >
        <p class="text-xs text-gray-500 mb-1">Change</p>
        <p :class="changeColor" class="font-semibold">
          {{ formatPercentage(stats.change) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimeRange } from "~/types";
import type { Chart as ChartType } from "chart.js";

const props = defineProps<{
  coinId: string;
}>();

const colorMode = useColorMode();
const { formatCurrency, formatPercentage } = useFormatters();

// Note: Removed "ALL" as CoinGecko free tier max is 365 days (same as 1Y)
const timeRanges: TimeRange[] = ["1D", "7D", "1M", "3M", "1Y"];
const selectedRange = ref<TimeRange>("7D");
const loading = ref(false);
const error = ref<string | null>(null);
const chartData = ref<{ timestamp: number; price: number }[]>([]);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: ChartType | null = null;
let ChartJS: typeof import("chart.js/auto").default | null = null;

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
  } catch (e: any) {
    error.value = e.message || "Failed to load chart data";
  } finally {
    loading.value = false;
    await nextTick();
    setTimeout(() => {
      if (chartData.value.length && !error.value) {
        createChart();
      }
    }, 100);
  }
};

const selectRange = (range: TimeRange) => {
  selectedRange.value = range;
  fetchData();
};

const createChart = async () => {
  if (!canvasRef.value || !chartData.value.length) return;

  if (!ChartJS) {
    const module = await import("chart.js/auto");
    ChartJS = module.default;
  }

  if (chart) {
    chart.destroy();
    chart = null;
  }

  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  const parent = canvasRef.value.parentElement;
  if (parent) {
    canvasRef.value.style.width = "100%";
    canvasRef.value.style.height = "100%";
  }

  const isPositive = stats.value.change >= 0;
  const color = isPositive ? "#10b981" : "#ef4444";
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(
    0,
    isPositive ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
  );
  gradient.addColorStop(1, "transparent");

  chart = new ChartJS(ctx, {
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
          type: "category",
          display: false,
        },
        y: {
          display: true,
          grid: {
            color:
              colorMode.value === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.08)",
          },
          ticks: {
            color: colorMode.value === "dark" ? "#9ca3af" : "#6b7280",
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
    chart = null;
  }
});

watch(
  () => colorMode.value,
  () => {
    if (chartData.value.length) {
      createChart();
    }
  },
);
</script>
