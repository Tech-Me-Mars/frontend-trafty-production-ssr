// ~/composables/useLongdoLoader.ts
export const useLongdoLoader = async () => {
    const res = await fetch('/api/load-longdo')
    const scriptCode = await res.text()
  
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.text = scriptCode
    document.head.appendChild(script)
  
    // รอจน window.longdo โหลดเสร็จ
    return new Promise<void>((resolve) => {
      const check = () => {
        if (window.longdo) resolve()
        else setTimeout(check, 100)
      }
      check()
    })
  }
  