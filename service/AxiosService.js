import { useEncryptedCookie, useDecryptedCookie, useClearEncryptedCookie } from '~/composables/useEncryptedCookie'
import axios from "axios";

// ตั้งค่า baseURL
const config = useRuntimeConfig();
axios.defaults.baseURL = config.public.api_url


const getToken = async () => {
  return await useDecryptedCookie('token') || '';
};

export async function request(method, url, data, auth = true) {
  const headers = {};
  const isloadingAxi = useState('isloadingAxi', () => true)
  isloadingAxi.value = true;

  try {
    if (auth) {
      const token = await getToken();
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios({
      method,
      url,
      data,
      headers,
    });

    isloadingAxi.value = false;
    return response;

  } catch (error) {
    isloadingAxi.value = false;

    console.error("request catch (error)", error);

    if (error.response?.status === 401) {
      console.warn("Token ไม่ถูกต้อง | หมดอายุ | ไม่มี Token");
      useClearEncryptedCookie("token") // 🔐 ลบ token จาก cookie
      // await navigateTo("/auth/login");
    } else if (error.response?.status === 403) {
      // await navigateTo("/auth/login");

      // await navigateTo("/Unauthorized");
    } else if (error.response?.status === 422) {
      console.log("Validation Error");
    } else if (error.response?.status === 500) {
      console.error("Server Error", error.response);
    }

    throw error;
  }
}
