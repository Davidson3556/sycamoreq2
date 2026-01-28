import { useCoinsStore } from '~/stores/coins'
import { usePortfolioStore } from '~/stores/portfolio'
import { useAlertsStore } from '~/stores/alerts'

export function usePriceUpdates(intervalMs = 30000) {
  const coinsStore = useCoinsStore()
  const portfolioStore = usePortfolioStore()
  const alertsStore = useAlertsStore()
  
  let intervalId: ReturnType<typeof setInterval> | null = null
  const isUpdating = ref(false)
  const lastUpdate = ref<Date | null>(null)
  
  const updatePrices = async () => {
    if (isUpdating.value) return
    
    isUpdating.value = true
    
    try {
      await coinsStore.updatePrices()
      
      if (portfolioStore.holdings.length > 0) {
        const priceMap: Record<string, number> = {}
        coinsStore.coins.forEach(coin => {
          priceMap[coin.id] = coin.price
        })
        portfolioStore.updatePrices(priceMap)
        
        alertsStore.checkAlerts(priceMap)
      }
      
      lastUpdate.value = new Date()
    } catch (error) {
      console.error('Failed to update prices:', error)
    } finally {
      isUpdating.value = false
    }
  }
  
  const startUpdates = () => {
    if (intervalId) return
    
    updatePrices()
    
    intervalId = setInterval(updatePrices, intervalMs)
  }
  
  const stopUpdates = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
  
  onUnmounted(() => {
    stopUpdates()
  })
  
  return {
    isUpdating: readonly(isUpdating),
    lastUpdate: readonly(lastUpdate),
    startUpdates,
    stopUpdates,
    updatePrices
  }
}
