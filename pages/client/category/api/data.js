import { request } from "@/service/AxiosService.js";

export function getBusinessByTypeId(id) {
  const url = `/api/v1/business/get-business-by-type-id/${id}`;
  return request("get", url, {}, true);
}

