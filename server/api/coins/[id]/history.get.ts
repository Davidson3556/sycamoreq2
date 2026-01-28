export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coin ID is required'
    })
  }
  
  // Map time range to days
  const rangeMap: Record<string, number | string> = {
    '1D': 1,
    '7D': 7,
    '1M': 30,
    '3M': 90,
    '1Y': 365,
    'ALL': 'max'
  }
  
  const range = (query.range as string) || '7D'
  const days = rangeMap[range] || 7
  
  try {
    const response = await $fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
      query: {
        vs_currency: 'usd',
        days: days
      },
      headers: {
        'x-cg-demo-api-key': config.coingeckoApiKey
      }
    })
    
    return response
  } catch (error: any) {
    console.error('CoinGecko API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch price history'
    })
  }
})
