export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const ids = query.ids as string
  
  if (!ids) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coin IDs are required'
    })
  }
  
  try {
    const response = await $fetch('https://api.coingecko.com/api/v3/simple/price', {
      query: {
        ids: ids,
        vs_currencies: 'usd',
        include_24hr_change: true
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
      statusMessage: error.message || 'Failed to fetch prices'
    })
  }
})
