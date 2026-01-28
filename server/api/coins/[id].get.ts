export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coin ID is required'
    })
  }
  
  try {
    const response = await $fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
      query: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true
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
      statusMessage: error.message || 'Failed to fetch coin details'
    })
  }
})
