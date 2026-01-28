export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const page = Number(query.page) || 1
  const perPage = Number(query.per_page) || 50
  const sparkline = query.sparkline !== 'false'
  
  try {
    const response = await $fetch<any[]>('https://api.coingecko.com/api/v3/coins/markets', {
      query: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: sparkline,
        price_change_percentage: '24h',
        locale: 'en'
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
      statusMessage: error.message || 'Failed to fetch coins'
    })
  }
})
