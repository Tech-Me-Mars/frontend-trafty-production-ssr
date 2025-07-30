// server/api/longdo-search.get.ts
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const keyword = (query.keyword as string)?.trim()
  
    if (!keyword || keyword.length < 4) {
      return { data: [], error: 'keyword ต้องมากกว่า 3 ตัวอักษร' }
    }
  
    const key = process.env.LONGDO_MAP_KEY
  
    const url = `https://search.longdo.com/mapsearch/json/search?keyword=${encodeURIComponent(keyword)}&limit=20&key=${key}`
    const response = await fetch(url)
    const data = await response.json()
  
    // Return data only (จะ Mask อะไรต่อก็ได้)
    return {
      data: data.data.map((item: any) => ({
        name: item.name,
        address: item.address || 'ไม่มีที่อยู่',
        lat: item.lat,
        lon: item.lon,
        id: item.id
      }))
    }
  })
  