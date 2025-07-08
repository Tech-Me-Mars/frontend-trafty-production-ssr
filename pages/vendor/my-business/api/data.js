import { request } from "@/service/AxiosService.js";

export function getMyBusiness() {
  const url = `/api/v1/business`;
  return request("get", url, {}, true);
}
