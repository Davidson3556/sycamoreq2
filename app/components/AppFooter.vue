<template>
  <footer class="bg-gray-950/50 border-t border-white/5 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <div
              class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center"
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
          </div>
          <p class="text-gray-500 text-sm max-w-md">
            Track your cryptocurrency portfolio with real-time prices,
            historical charts, and price alerts. Make informed investment
            decisions with comprehensive market data.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-white mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm text-gray-500 hover:text-emerald-400 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-white mb-4">Resources</h4>
          <ul class="space-y-2">
            <li v-for="link in resourceLinks" :key="link.href">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                {{ link.label }}
                <UIcon
                  name="i-heroicons-arrow-top-right-on-square"
                  class="w-3 h-3"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <p class="text-sm text-gray-600">
          © {{ new Date().getFullYear() }} CryptoTrack. Data provided by
          CoinGecko.
        </p>
        <div class="flex items-center gap-4">
          <a
            v-for="social in socials"
            :key="social.href"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-200"
          >
            <UIcon :name="social.icon" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const quickLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/markets", label: "Markets" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/alerts", label: "Price Alerts" },
];

const resourceLinks = [
  { href: "https://www.coingecko.com", label: "CoinGecko" },
  { href: "https://github.com", label: "GitHub" },
];

const socials = [
  { href: "https://twitter.com", icon: "i-simple-icons-x" },
  { href: "https://github.com", icon: "i-simple-icons-github" },
  { href: "https://discord.com", icon: "i-simple-icons-discord" },
];
</script>
