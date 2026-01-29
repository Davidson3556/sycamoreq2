<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-white/5 transition-colors duration-300"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div
            class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow"
          >
            <UIcon
              name="i-heroicons-chart-bar-solid"
              class="w-5 h-5 text-gray-900"
            />
          </div>
          <span
            class="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          >
            CryptoTrack
          </span>
        </NuxtLink>

        <div class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              $route.path === link.to
                ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gradient-to-r dark:from-emerald-500/10 dark:to-cyan-500/10 border border-gray-200 dark:border-emerald-500/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5',
            ]"
          >
            <UIcon :name="link.icon" class="w-4 h-4" />
            <span>{{ link.label }}</span>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2">
          <div
            v-if="lastUpdate"
            class="hidden lg:flex items-center gap-2 text-xs text-gray-500 mr-2"
          >
            <span
              class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
            ></span>
            <span>Updated {{ formatDate(lastUpdate, "relative") }}</span>
          </div>

          <button
            @click="toggleColorMode"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            :aria-label="
              colorMode.value === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            "
          >
            <UIcon
              :name="
                colorMode.value === 'dark'
                  ? 'i-heroicons-moon'
                  : 'i-heroicons-sun'
              "
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
            />
          </button>

          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <UIcon
              :name="
                isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'
              "
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
            />
          </button>
        </div>
      </div>

      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2 max-h-0"
        enter-to-class="opacity-100 translate-y-0 max-h-96"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 max-h-96"
        leave-to-class="opacity-0 -translate-y-2 max-h-0"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden py-4 border-t border-gray-200 dark:border-white/5 overflow-hidden"
        >
          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
              :class="[
                $route.path === link.to
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gradient-to-r dark:from-emerald-500/10 dark:to-cyan-500/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5',
              ]"
              @click="isMobileMenuOpen = false"
            >
              <UIcon :name="link.icon" class="w-5 h-5" />
              <span>{{ link.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const route = useRoute();
const { formatDate } = useFormatters();

const isMobileMenuOpen = ref(false);
const lastUpdate = ref<Date | null>(null);

const navLinks = [
  { to: "/", label: "Dashboard", icon: "i-heroicons-home" },
  { to: "/markets", label: "Markets", icon: "i-heroicons-chart-bar" },
  { to: "/portfolio", label: "Portfolio", icon: "i-heroicons-wallet" },
  { to: "/alerts", label: "Alerts", icon: "i-heroicons-bell" },
];

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  },
);

const coinsStore = useCoinsStore();
watch(
  () => coinsStore.lastUpdated,
  (newVal) => {
    if (newVal) lastUpdate.value = newVal;
  },
);
</script>
