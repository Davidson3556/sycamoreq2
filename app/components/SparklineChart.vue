<template>
  <div class="w-full h-full">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
);

const props = defineProps<{
  data: number[];
  positive?: boolean;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const createChart = () => {
  if (!canvasRef.value || !props.data.length) return;

  if (chart) {
    chart.destroy();
  }

  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  const color = props.positive ? "#10b981" : "#ef4444";
  const gradient = ctx.createLinearGradient(0, 0, 0, 40);
  gradient.addColorStop(
    0,
    props.positive ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
  );
  gradient.addColorStop(1, "transparent");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: props.data.map((_, i) => i.toString()),
      datasets: [
        {
          data: props.data,
          borderColor: color,
          borderWidth: 1.5,
          fill: true,
          backgroundColor: gradient,
          pointRadius: 0,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      animation: false,
    },
  });
};

onMounted(() => {
  createChart();
});

watch(
  () => props.data,
  () => {
    createChart();
  },
  { deep: true },
);

onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>
