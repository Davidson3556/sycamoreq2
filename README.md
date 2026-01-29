# CryptoTrack - Cryptocurrency Portfolio Tracker

A premium cryptocurrency portfolio tracker built with Nuxt 4, featuring real-time prices, historical charts, price alerts, and profit/loss tracking.

**[Live Demo](https://sycamoreq2.vercel.app/)** | **[GitHub Repository](https://github.com/Davidson3556/sycamoreq2)**

![Nuxt](https://img.shields.io/badge/Nuxt-4.3.0-00DC82?style=flat-square&logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=flat-square&logo=tailwindcss)

---

## Assessment Criteria Coverage

### ✅ Data Fetching from API

- Uses **CoinGecko API** for cryptocurrency market data
- All API calls proxied through **Nuxt server routes** for security
- Uses Nuxt's built-in **`$fetch`** for optimized data fetching

### ✅ Loading, Error, and Empty States

- **`LoadingScreen.vue`** - Global loading overlay on initial app load
- **`LoadingState.vue`** - Inline loading spinner for sections
- **`ErrorState.vue`** - Error display with retry functionality
- **`EmptyState.vue`** - Friendly empty state for no data scenarios

### ✅ Code Organization

- Clean separation: `components/`, `composables/`, `stores/`, `pages/`, `server/api/`
- TypeScript interfaces in `types/index.ts`
- Reusable composables for shared logic

---

## Features

- **Real-time Price Updates** - Automatic price refresh every 30 seconds
- **Historical Charts** - Interactive price charts with 5 time ranges (1D, 7D, 1M, 3M, 1Y)
- **Portfolio Management** - Track holdings, calculate profit/loss, and monitor performance
- **Price Alerts** - Get notified when coins reach your target prices
- **50+ Cryptocurrencies** - Track major coins from CoinGecko API
- **Dark/Light Mode** - Consistent theming with Tailwind CSS

---

## API Architecture

### External API

**CoinGecko API** (Free Tier) - Cryptocurrency market data provider

### Internal API Routes (Nuxt Server)

| Route                    | Method | Description                        | CoinGecko Endpoint         |
| ------------------------ | ------ | ---------------------------------- | -------------------------- |
| `/api/coins`             | GET    | Fetch coin list with market data   | `/coins/markets`           |
| `/api/coins/:id`         | GET    | Get detailed coin information      | `/coins/{id}`              |
| `/api/coins/:id/history` | GET    | Get price history for charts       | `/coins/{id}/market_chart` |
| `/api/coins/prices`      | GET    | Get live prices for multiple coins | `/simple/price`            |

### Why Server-Side API Proxy?

1. **Security** - API key hidden from client-side code
2. **CORS** - Avoids browser CORS restrictions
3. **Rate Limiting** - Server-side control over API calls
4. **Future Caching** - Easy to add response caching

---

## State Handling

### Loading States

```vue
<!-- Example: Markets page -->
<LoadingState v-if="coinsStore.loading" message="Loading market data..." />
<ErrorState
  v-else-if="coinsStore.error"
  :message="coinsStore.error"
  @retry="fetchData"
/>
<EmptyState v-else-if="!coins.length" title="No coins found" />
<CoinList v-else :coins="coins" />
```

### State Management (Pinia)

| Store          | Purpose                            | Persistence  |
| -------------- | ---------------------------------- | ------------ |
| `coins.ts`     | Market data, search, selected coin | Memory only  |
| `portfolio.ts` | User holdings, P/L calculations    | localStorage |
| `alerts.ts`    | Price alert configurations         | localStorage |

---

## Tech Stack

| Layer         | Technology        | Reason                                |
| ------------- | ----------------- | ------------------------------------- |
| **Framework** | Nuxt 4            | Auto-imports, file-based routing, SSR |
| **UI**        | @nuxt/ui v4       | Pre-built components, dark mode       |
| **Styling**   | Tailwind CSS      | Utility-first, `dark:` variants       |
| **State**     | Pinia             | TypeScript support, simple API        |
| **Charts**    | Chart.js          | Canvas-based, performant              |
| **API**       | $fetch (built-in) | Zero bundle size, SSR-ready           |

---

## Technical Decisions

### Why `$fetch` over Axios?

- **Zero bundle size** - Built into Nuxt
- **SSR-ready** - Works seamlessly on server and client
- **Auto baseURL** - Automatic handling of API routes
- **Native integration** - Works with `useFetch` and `useAsyncData`

### Why Tailwind CSS with `dark:` variants?

- Simple, consistent theming approach
- No custom CSS variables needed
- Easy maintenance and readability
- Built-in support in @nuxt/ui

### Why Chart.js?

- Canvas-based for smooth real-time updates
- Small bundle size (~60KB)
- Extensive customization
- Good TypeScript support

---

## Project Structure

```
app/
├── assets/css/          # Global styles
├── components/          # Vue components
│   ├── LoadingScreen.vue   # Global loading overlay
│   ├── LoadingState.vue    # Inline loader
│   ├── ErrorState.vue      # Error with retry
│   ├── EmptyState.vue      # Empty data state
│   ├── PriceChart.vue      # Historical chart
│   └── ...
├── composables/         # Reusable logic
│   ├── useFormatters.ts    # Currency/number formatting
│   └── usePriceUpdates.ts  # Price polling
├── pages/               # Route pages
├── stores/              # Pinia stores
└── types/               # TypeScript interfaces

server/
└── api/coins/           # API proxy routes
    ├── [id]/history.get.ts
    ├── [id].get.ts
    ├── index.get.ts
    └── prices.get.ts
```

---

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

Create a `.env` file:

```env
COINGECKO_API_KEY=your_api_key_here
```

---

## Pages Overview

| Page        | Route        | Description                          |
| ----------- | ------------ | ------------------------------------ |
| Dashboard   | `/`          | Portfolio summary, market overview   |
| Markets     | `/markets`   | Searchable cryptocurrency list       |
| Coin Detail | `/coin/:id`  | Price chart, stats, add to portfolio |
| Portfolio   | `/portfolio` | Manage holdings, view P/L            |
| Alerts      | `/alerts`    | Price alert management               |

---

## Key Implementations

### Real-time Price Updates

```typescript
// usePriceUpdates.ts
const startUpdates = () => {
  intervalId = window.setInterval(async () => {
    await coinsStore.updatePrices();
    portfolioStore.updateValues(coinsStore.coins);
    alertsStore.checkAlerts(coinsStore.coins);
  }, 30000); // 30 seconds
};
```

### Profit/Loss Calculation

```typescript
// Portfolio store
currentValue = amount × currentPrice
cost = amount × buyPrice
profitLoss = currentValue - cost
profitLossPercentage = (profitLoss / cost) × 100
```

---

## Performance Considerations

- **Lazy chart loading** - Charts render only when visible
- **Debounced search** - 300ms delay on input
- **Canvas charts** - Better performance than SVG
- **Minimal re-renders** - Computed properties for derived data

---

