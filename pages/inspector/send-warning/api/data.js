import { request } from "@/service/AxiosService.js";

export function getSurveyFailed() {
  const url = `/api/v1/survey-police/get-survey-police-status-failed`;
  return request("get", url, {}, true);
}

export function getSuveyAuditPolice(id) {
  const url = `/api/v1/survey-police/get-survey-audit-police/${id}`;
  return request("get", url, {}, true);
}
export function getSuveyAuditPoliceAndUpdate(id) {
  const url = `/api/v1/survey-warning-respond/get-survey-police-id-by-survey-warning-id/${id}`;
  return request("get", url, {}, true);
}

export function saveSurveyPoliceWarning(payload) {
  const url = `/api/v1/survey-waiting/save-survey-police-warning`;
  return request("post", url, payload, true);
}


