import { defineStore } from 'pinia'
import type { PriceAlert } from '~/types'

interface AlertsState {
  alerts: PriceAlert[]
}

export const useAlertsStore = defineStore('alerts', {
  state: (): AlertsState => ({
    alerts: []
  }),
  
  getters: {
    activeAlerts(): PriceAlert[] {
      return this.alerts.filter(a => a.isActive && !a.isTriggered)
    },
    
    triggeredAlerts(): PriceAlert[] {
      return this.alerts.filter(a => a.isTriggered)
    },
    
    alertCount(): number {
      return this.alerts.length
    },
    
    activeAlertCount(): number {
      return this.activeAlerts.length
    },
    
    getAlertsByCoin: (state) => (coinId: string): PriceAlert[] => {
      return state.alerts.filter(a => a.coinId === coinId)
    }
  },
  
  actions: {
    addAlert(alert: Omit<PriceAlert, 'id' | 'isTriggered' | 'createdAt'>) {
      const newAlert: PriceAlert = {
        ...alert,
        id: crypto.randomUUID(),
        isTriggered: false,
        createdAt: new Date().toISOString()
      }
      this.alerts.push(newAlert)
      this.saveToStorage()
    },
    
    removeAlert(id: string) {
      this.alerts = this.alerts.filter(a => a.id !== id)
      this.saveToStorage()
    },
    
    toggleAlert(id: string) {
      const alert = this.alerts.find(a => a.id === id)
      if (alert) {
        alert.isActive = !alert.isActive
        this.saveToStorage()
      }
    },
    
    checkAlerts(prices: Record<string, number>) {
      const triggeredAlerts: PriceAlert[] = []
      
      this.alerts.forEach(alert => {
        if (!alert.isActive || alert.isTriggered) return
        
        const currentPrice = prices[alert.coinId]
        if (!currentPrice) return
        
        const shouldTrigger = 
          (alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
          (alert.direction === 'below' && currentPrice <= alert.targetPrice)
        
        if (shouldTrigger) {
          alert.isTriggered = true
          alert.triggeredAt = new Date().toISOString()
          triggeredAlerts.push(alert)
        }
      })
      
      if (triggeredAlerts.length > 0) {
        this.saveToStorage()
        this.notifyUser(triggeredAlerts)
      }
      
      return triggeredAlerts
    },
    
    notifyUser(alerts: PriceAlert[]) {
      if (!import.meta.client) return
      
      if ('Notification' in window && Notification.permission === 'granted') {
        alerts.forEach(alert => {
          new Notification(`Price Alert: ${alert.coinSymbol.toUpperCase()}`, {
            body: `${alert.coinName} has gone ${alert.direction} $${alert.targetPrice}`,
            icon: alert.coinImage
          })
        })
      }
    },
    
    async requestNotificationPermission() {
      if (!import.meta.client) return false
      
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
      }
      return false
    },
    
    resetTriggeredAlert(id: string) {
      const alert = this.alerts.find(a => a.id === id)
      if (alert) {
        alert.isTriggered = false
        alert.triggeredAt = undefined
        this.saveToStorage()
      }
    },
    
    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem('price-alerts', JSON.stringify(this.alerts))
      }
    },
    
    loadFromStorage() {
      if (import.meta.client) {
        const stored = localStorage.getItem('price-alerts')
        if (stored) {
          try {
            this.alerts = JSON.parse(stored)
          } catch (e) {
            console.error('Failed to parse stored alerts:', e)
          }
        }
      }
    },
    
    clearAllAlerts() {
      this.alerts = []
      this.saveToStorage()
    }
  }
})
