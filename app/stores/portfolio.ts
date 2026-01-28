import { defineStore } from 'pinia'
import type { Holding, HoldingWithValue, PortfolioSummary } from '~/types'

interface PortfolioState {
  holdings: Holding[]
}

export const usePortfolioStore = defineStore('portfolio', {
  state: (): PortfolioState => ({
    holdings: []
  }),
  
  getters: {
    holdingsWithValues(): HoldingWithValue[] {
      return this.holdings.map(holding => {
        const currentPrice = holding.currentPrice || holding.buyPrice
        const currentValue = holding.amount * currentPrice
        const cost = holding.amount * holding.buyPrice
        const profitLoss = currentValue - cost
        const profitLossPercentage = cost > 0 ? (profitLoss / cost) * 100 : 0
        
        return {
          ...holding,
          currentValue,
          profitLoss,
          profitLossPercentage
        }
      })
    },
    
    summary(): PortfolioSummary {
      const holdingsWithValues = this.holdingsWithValues
      
      const totalValue = holdingsWithValues.reduce((sum, h) => sum + h.currentValue, 0)
      const totalCost = holdingsWithValues.reduce((sum, h) => sum + (h.amount * h.buyPrice), 0)
      const profitLoss = totalValue - totalCost
      const profitLossPercentage = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0
      
      return {
        totalValue,
        totalCost,
        profitLoss,
        profitLossPercentage,
        holdings: holdingsWithValues
      }
    },
    
    holdingCount(): number {
      return this.holdings.length
    },
    
    uniqueCoinIds(): string[] {
      return [...new Set(this.holdings.map(h => h.coinId))]
    }
  },
  
  actions: {
    addHolding(holding: Omit<Holding, 'id'>) {
      const newHolding: Holding = {
        ...holding,
        id: crypto.randomUUID()
      }
      this.holdings.push(newHolding)
      this.saveToStorage()
    },
    
    updateHolding(id: string, updates: Partial<Holding>) {
      const index = this.holdings.findIndex(h => h.id === id)
      if (index !== -1) {
        const holding = this.holdings[index]
        if (holding) {
          this.holdings[index] = { ...holding, ...updates }
          this.saveToStorage()
        }
      }
    },
    
    removeHolding(id: string) {
      this.holdings = this.holdings.filter(h => h.id !== id)
      this.saveToStorage()
    },
    
    updatePrices(prices: Record<string, number>) {
      this.holdings = this.holdings.map(holding => ({
        ...holding,
        currentPrice: prices[holding.coinId] ?? holding.currentPrice
      }))
    },
    
    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem('portfolio-holdings', JSON.stringify(this.holdings))
      }
    },
    
    loadFromStorage() {
      if (import.meta.client) {
        const stored = localStorage.getItem('portfolio-holdings')
        if (stored) {
          try {
            this.holdings = JSON.parse(stored)
          } catch (e) {
            console.error('Failed to parse stored holdings:', e)
          }
        }
      }
    },
    
    clearPortfolio() {
      this.holdings = []
      this.saveToStorage()
    }
  }
})
