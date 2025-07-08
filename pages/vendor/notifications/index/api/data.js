import { request } from "@/service/AxiosService.js";

export function geySurveyBuId(id) {
  const url = `/api/v1/survey/get-survey/${id}`;
  return request("get", url, {}, true);
}


export function getNotify(id) {
  const url = `/api/v1/notications/update-notifications-by-business-id/${id}`;
  return request("get", url, {}, true);
}

