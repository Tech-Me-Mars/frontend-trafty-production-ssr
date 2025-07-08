import { request } from "@/service/AxiosService.js";

export function getSurveyWaringByBusinessId(id) {
  const url = `/api/v1/survey-warning-respond/get-survey-warning-by-business-id/${id}`;
  return request("get", url, {}, true);
}



