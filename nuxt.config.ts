// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: ['@nuxt/ui', '@vueuse/motion/nuxt', '@pinia/nuxt'],
  
  css: ['~/assets/css/main.css'],
  
  runtimeConfig: {
    coingeckoApiKey: process.env.COINGECKO_API_KEY,
  },
  
  app: {
    head: {
      title: 'CryptoTrack - Portfolio Tracker',
      meta: [
        { name: 'description', content: 'Track your cryptocurrency portfolio with real-time prices, historical charts, and price alerts.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'author', content: 'CryptoTrack' },
        { name: 'keywords', content: 'cryptocurrency, bitcoin, ethereum, portfolio, tracker, price alerts, trading' },
        { property: 'og:title', content: 'CryptoTrack - Cryptocurrency Portfolio Tracker' },
        { property: 'og:description', content: 'Track your crypto portfolio with real-time prices and historical charts.' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'CryptoTrack - Portfolio Tracker' },
        { name: 'twitter:description', content: 'Real-time cryptocurrency portfolio tracking.' },
        { name: 'theme-color', content: '#0f0f23' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  
  ui: {
    fonts: true,
    colorMode: true
  },
  
  colorMode: {
    preference: 'dark'
  }
})
