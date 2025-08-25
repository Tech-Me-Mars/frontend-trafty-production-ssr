// server/api/file-proxy.ts
export default defineEventHandler(async (event) => {
    const url = getQuery(event).url as string
    if (!url) { setResponseStatus(event, 400); return 'Missing url' }
    const r = await fetch(url)
    if (!r.ok) { setResponseStatus(event, r.status); return 'Fetch failed' }
    const ab = await r.arrayBuffer()
    const ct = r.headers.get('content-type') || 'application/octet-stream'
    setHeader(event, 'Content-Type', ct)
    return new Uint8Array(ab)
  })
  