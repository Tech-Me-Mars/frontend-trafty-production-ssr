import { request } from "@/service/AxiosService.js";

export function geySurveyBuId(id) {
  const url = `/api/v1/survey/get-survey/${id}`;
  return request("get", url, {}, true);
}

export function saveSurveyVendor(payload) {
  const url = `/api/v1/survey/save-survey`;
  return request("post", url, payload, true);
}

