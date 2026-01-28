// Coin data from CoinGecko API
export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
  sparkline_in_7d?: {
    price: number[]
  }
}

// Simplified coin for display
export interface SimpleCoin {
  id: string
  symbol: string
  name: string
  image: string
  price: number
  change24h: number
  marketCap: number
  rank: number
  sparkline?: number[]
}

// User holding in portfolio
export interface Holding {
  id: string
  coinId: string
  coinName: string
  coinSymbol: string
  coinImage: string
  amount: number
  buyPrice: number
  buyDate: string
  currentPrice?: number
}

// Portfolio summary calculations
export interface PortfolioSummary {
  totalValue: number
  totalCost: number
  profitLoss: number
  profitLossPercentage: number
  holdings: HoldingWithValue[]
}

// Holding with calculated values
export interface HoldingWithValue extends Holding {
  currentValue: number
  profitLoss: number
  profitLossPercentage: number
}

// Price alert configuration
export interface PriceAlert {
  id: string
  coinId: string
  coinName: string
  coinSymbol: string
  coinImage: string
  targetPrice: number
  direction: 'above' | 'below'
  isActive: boolean
  isTriggered: boolean
  createdAt: string
  triggeredAt?: string
}

// Historical price data point
export interface PriceDataPoint {
  timestamp: number
  price: number
}

// Chart time range options
export type TimeRange = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL'

// API response types
export interface CoinGeckoMarketResponse {
  coins: Coin[]
}

export interface CoinGeckoHistoryResponse {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export interface CoinGeckoPricesResponse {
  [coinId: string]: {
    usd: number
    usd_24h_change?: number
  }
}

// Global market data
export interface GlobalMarketData {
  total_market_cap: { usd: number }
  total_volume: { usd: number }
  market_cap_percentage: { btc: number; eth: number }
  market_cap_change_percentage_24h_usd: number
}

// App state types
export interface LoadingState {
  isLoading: boolean
  error: string | null
}
