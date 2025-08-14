import { useDecryptedCookie } from '~/composables/useEncryptedCookie'

export function useGetLatLon(options = {}) {
  const lat = ref(null)
  const lon = ref(null)
  const accuracy = ref(null)
  const source = ref(null) // 'geolocation' | 'cookie' | null
  const error = ref('')
  const ready = ref(false)

  const cfg = {
    redirectIfMissing: options.redirectIfMissing ?? true,
    redirectTo: options.redirectTo ?? '/settings/my-location',
    timeoutMs: options.timeoutMs ?? 8000,
    highAccuracy: options.highAccuracy ?? true,
  }

  const checkBoth = () => {
    const ok = lat.value !== null && lon.value !== null && lat.value !== '' && lon.value !== ''
    if (!ok && cfg.redirectIfMissing) {
      navigateTo(cfg.redirectTo)
    }
    return ok
  }

  const fromCookie = async () => {
    try {
      const rawLat = await Promise.resolve(useDecryptedCookie('latitude'))
      const rawLon = await Promise.resolve(useDecryptedCookie('longitude'))
      const latVal = rawLat?.value ?? rawLat
      const lonVal = rawLon?.value ?? rawLon

      if (latVal && lonVal) {
        lat.value = Number(latVal)
        lon.value = Number(lonVal)
        source.value = 'cookie'
        return true
      }
    } catch {}
    return false
  }

  const fromGeolocation = () =>
    new Promise((resolve) => {
      if (!process.client || !('geolocation' in navigator)) {
        resolve(false)
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat.value = pos.coords.latitude
          lon.value = pos.coords.longitude
          accuracy.value = pos.coords.accuracy ?? null
          source.value = 'geolocation'
          resolve(true)
        },
        () => resolve(false),
        {
          enableHighAccuracy: cfg.highAccuracy,
          timeout: cfg.timeoutMs,
          maximumAge: 0,
        }
      )
    })

  const decide = async () => {
    const okGeo = await fromGeolocation()
    if (okGeo && checkBoth()) return

    const okCookie = await fromCookie()
    if (okCookie && checkBoth()) return

    checkBoth()
  }

  const init = async () => {
    if (!process.client) return
    await decide()
    ready.value = true
  }

  if (process.client) {
    init()
  }

  return {
    lat,
    lon,
    accuracy,
    source,
    error,
    ready,
    refresh: decide,
  }
}
