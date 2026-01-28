import { defineStore } from 'pinia'
import type { Coin, SimpleCoin } from '~/types'

interface CoinsState {
  coins: SimpleCoin[]
  selectedCoin: any | null
  loading: boolean
  error: string | null
  searchQuery: string
  lastUpdated: Date | null
}

export const useCoinsStore = defineStore('coins', {
  state: (): CoinsState => ({
    coins: [],
    selectedCoin: null,
    loading: false,
    error: null,
    searchQuery: '',
    lastUpdated: null
  }),
  
  getters: {
    filteredCoins: (state): SimpleCoin[] => {
      if (!state.searchQuery) return state.coins
      const query = state.searchQuery.toLowerCase()
      return state.coins.filter(coin => 
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
      )
    },
    
    topGainers: (state): SimpleCoin[] => {
      return [...state.coins]
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, 5)
    },
    
    topLosers: (state): SimpleCoin[] => {
      return [...state.coins]
        .sort((a, b) => a.change24h - b.change24h)
        .slice(0, 5)
    },
    
    getCoinById: (state) => (id: string): SimpleCoin | undefined => {
      return state.coins.find(coin => coin.id === id)
    }
  },
  
  actions: {
    async fetchCoins(page = 1, perPage = 50) {
      this.loading = true
      this.error = null
      
      try {
        const data = await $fetch<Coin[]>('/api/coins', {
          query: { page, per_page: perPage, sparkline: true }
        })
        
        this.coins = data.map(coin => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h,
          marketCap: coin.market_cap,
          rank: coin.market_cap_rank,
          sparkline: coin.sparkline_in_7d?.price
        }))
        
        this.lastUpdated = new Date()
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch coins'
        console.error('Error fetching coins:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchCoinDetails(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const data = await $fetch(`/api/coins/${id}`)
        this.selectedCoin = data
        return data
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch coin details'
        console.error('Error fetching coin details:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    async updatePrices() {
      if (this.coins.length === 0) return
      
      const ids = this.coins.map(c => c.id).join(',')
      
      try {
        const data = await $fetch<Record<string, { usd: number; usd_24h_change?: number }>>('/api/coins/prices', {
          query: { ids }
        })
        
        this.coins = this.coins.map(coin => ({
          ...coin,
          price: data[coin.id]?.usd ?? coin.price,
          change24h: data[coin.id]?.usd_24h_change ?? coin.change24h
        }))
        
        this.lastUpdated = new Date()
      } catch (error) {
        console.error('Error updating prices:', error)
      }
    },
    
    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    
    clearSelectedCoin() {
      this.selectedCoin = null
    }
  }
})
