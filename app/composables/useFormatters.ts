export function useFormatters() {
  const formatCurrency = (value: number, currency = 'USD', decimals?: number): string => {
    const absValue = Math.abs(value)
    
    let minDecimals = decimals ?? (absValue < 1 ? 4 : absValue < 100 ? 2 : 0)
    let maxDecimals = decimals ?? (absValue < 1 ? 6 : 2)
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals
    }).format(value)
  }
  
  const formatPercentage = (value: number, decimals = 2): string => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(decimals)}%`
  }
  
  const formatNumber = (value: number, decimals = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }).format(value)
  }
  
  const formatCompactNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 2
    }).format(value)
  }
  
  const formatDate = (date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    
    if (format === 'relative') {
      const now = new Date()
      const diff = now.getTime() - d.getTime()
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      
      if (seconds < 60) return 'just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days < 7) return `${days}d ago`
    }
    
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: format === 'long' ? 'long' : 'short',
      timeStyle: format === 'long' ? 'short' : undefined
    }).format(d)
  }
  
  const formatChange = (value: number): { text: string; class: string; icon: string } => {
    const isPositive = value >= 0
    return {
      text: formatPercentage(value),
      class: isPositive ? 'text-emerald-400' : 'text-red-400',
      icon: isPositive ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'
    }
  }
  
  return {
    formatCurrency,
    formatPercentage,
    formatNumber,
    formatCompactNumber,
    formatDate,
    formatChange
  }
}
