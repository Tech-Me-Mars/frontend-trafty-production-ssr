import { request } from "@/service/AxiosService.js";

export function getHotAll() {
  const url = `/api/v1/business/hot-place-all`;
  return request("get", url, {}, false);
}

