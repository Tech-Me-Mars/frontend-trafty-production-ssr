import { request } from "@/service/AxiosService.js";

export function getSurveyWarningById(id) {
  const url = `/api/v1/survey-warning/get-survey-warning-by-id/${id}`;
  return request("get", url, {}, true);
}
export function saveReplyWarning(payload) {
  const url = `/api/v1/survey-warning-respond/insert-survey-warning-respond`;
  return request("post", url, payload, true);
}

export function updateVendorReply(payload) {
  const url = `/api/v1/survey-waiting/update-survey-warning`;
  return request("put", url, payload, true);
}






