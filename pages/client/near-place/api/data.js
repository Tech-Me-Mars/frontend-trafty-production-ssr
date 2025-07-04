import { request } from "@/service/AxiosService.js";

export function getNearPlace() {
  const url = `/api/v1/business/near-place`;
  return request("get", url, {}, true);
}


