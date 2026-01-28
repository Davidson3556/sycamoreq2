# CryptoTrack - Cryptocurrency Portfolio Tracker

A premium cryptocurrency portfolio tracker built with Nuxt 4, featuring real-time prices, historical charts, price alerts, and profit/loss tracking.

**[Live Demo](https://sycamoreq2.vercel.app/)** | **[GitHub Repository](https://github.com/Davidson3556/sycamoreq2)**

![Nuxt](https://img.shields.io/badge/Nuxt-4.3.0-00DC82?style=flat-square&logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=flat-square&logo=tailwindcss)

## Features

- **Real-time Price Updates** - Automatic price refresh every 30 seconds
- **Historical Charts** - Interactive price charts with multiple time ranges (1D, 7D, 1M, 3M, 1Y, ALL)
- **Portfolio Management** - Track holdings, calculate profit/loss, and monitor performance
- **Price Alerts** - Get notified when coins reach your target prices
- **50+ Cryptocurrencies** - Track major coins from CoinGecko API
- **Dark Mode** - Premium glassmorphism UI with smooth animations

## Tech Stack

| Layer          | Technology     | Reason                                                         |
| -------------- | -------------- | -------------------------------------------------------------- |
| **Framework**  | Nuxt 4         | Latest SSR/SSG features, auto-imports, file-based routing      |
| **UI**         | @nuxt/ui v4    | Pre-built components, built-in dark mode, Tailwind integration |
| **State**      | Pinia          | Official Vue state management, TypeScript support, devtools    |
| **Charts**     | Chart.js       | Lightweight, canvas-based, good performance for real-time data |
| **Animations** | @vueuse/motion | Vue-native animations, composable API                          |
| **API**        | CoinGecko      | Free tier, comprehensive crypto data, reliable uptime          |

## Technical Decisions

### Why Nuxt 4?

- **Auto-imports**: No manual imports for composables, components, or utils
- **File-based routing**: Automatic route generation from directory structure
- **Server API routes**: Built-in API layer for proxying external requests
- **SSR by default**: SEO-friendly with hydration for interactivity

### Why Pinia over Vuex?

- Simpler API with no mutations (just state, getters, actions)
- First-class TypeScript support
- Composable store design
- Built-in devtools integration

### Why Chart.js?

- Canvas-based rendering for smooth performance
- Small bundle size (~60KB)
- Extensive customization options
- Good documentation and community

### API Architecture

Server-side API routes proxy all CoinGecko requests because:

1. **Security**: API key hidden from client
2. **CORS**: Avoids browser CORS restrictions
3. **Caching**: Future caching layer possible
4. **Rate limiting**: Server-side control

### State Persistence Strategy

- Portfolio holdings and price alerts stored in localStorage
- Loaded on app mount via Pinia actions
- Reactive updates trigger automatic saves

## Project Structure

```
app/
├── assets/css/          # Global styles and Tailwind config
├── components/          # Vue components
│   ├── AddHoldingModal.vue
│   ├── AlertCard.vue
│   ├── AlertForm.vue
│   ├── AppFooter.vue
│   ├── AppNavbar.vue
│   ├── CoinCard.vue
│   ├── CoinList.vue
│   ├── EmptyState.vue
│   ├── ErrorState.vue
│   ├── HoldingCard.vue
│   ├── LoadingScreen.vue
│   ├── LoadingState.vue
│   ├── PortfolioSummary.vue
│   ├── PriceChart.vue
│   └── SparklineChart.vue
├── composables/         # Reusable logic
│   ├── useFormatters.ts # Currency/number formatting
│   └── usePriceUpdates.ts # Real-time price polling
├── pages/               # Route pages
│   ├── alerts.vue
│   ├── coin/[id].vue
│   ├── index.vue
│   ├── markets.vue
│   └── portfolio.vue
├── stores/              # Pinia stores
│   ├── alerts.ts
│   ├── coins.ts
│   └── portfolio.ts
├── types/               # TypeScript interfaces
│   └── index.ts
└── app.vue              # Root layout

server/
└── api/coins/           # API routes
    ├── [id]/history.get.ts
    ├── [id].get.ts
    ├── index.get.ts
    └── prices.get.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root:

```env
COINGECKO_API_KEY=your_api_key_here
```

## Pages Overview

| Page        | Route        | Description                                    |
| ----------- | ------------ | ---------------------------------------------- |
| Dashboard   | `/`          | Portfolio summary, market overview, top movers |
| Markets     | `/markets`   | Searchable list of all cryptocurrencies        |
| Coin Detail | `/coin/:id`  | Price chart, stats, add to portfolio/alerts    |
| Portfolio   | `/portfolio` | Manage holdings, view P/L                      |
| Alerts      | `/alerts`    | Create and manage price alerts                 |

## Key Features Implementation

### Real-time Price Updates

The `usePriceUpdates` composable provides automatic price refresh:

- Polls CoinGecko every 30 seconds
- Updates coin store, portfolio values, and checks alerts
- Auto-starts on mount, auto-stops on unmount

### Profit/Loss Calculation

Portfolio store calculates in real-time:

- Current value = Amount × Current Price
- Cost = Amount × Buy Price
- P/L = Current Value - Cost
- P/L % = (P/L / Cost) × 100

### Price Alerts

Alert system with browser notifications:

- Set target price with direction (above/below)
- Background checking on price updates
- Browser Notification API for alerts
- Persisted to localStorage

## Performance Considerations

- **Lazy components**: Charts only render when visible
- **Virtual scrolling**: Consider for large coin lists
- **Debounced search**: 300ms delay on input
- **Canvas charts**: Better performance than SVG for real-time
