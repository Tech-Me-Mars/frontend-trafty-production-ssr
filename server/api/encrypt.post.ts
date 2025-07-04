import { readBody } from 'h3'
import CryptoJS from 'crypto-js'

export default defineEventHandler(async (event) => {
    const body = await readBody<{ data: any }>(event)
      const config = useRuntimeConfig()
      const secret = config.cookieSecret || 'default_secret'


    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(body.data), secret).toString()

    return { encrypted }
})
