import { request } from "@/service/AxiosService.js";

export function getSuveyBusiness(id) {
  const url = `/api/v1/survey/get-survey-business/${id}`;
  return request("get", url, {}, true);
}

