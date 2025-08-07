import { request } from "@/service/AxiosService.js";

export function getMyBusiness() {
  const url = `/api/v1/management/business/get-business-by-user-id`;
  return request("get", url, {}, true);
}
