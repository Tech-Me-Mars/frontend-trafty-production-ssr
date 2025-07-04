import { request } from "@/service/AxiosService.js";

export function getComment(id) {
  const url = `/api/v1/business-comment/get-by-business-id/${id}`;
  return request("get", url, {}, true);
}

