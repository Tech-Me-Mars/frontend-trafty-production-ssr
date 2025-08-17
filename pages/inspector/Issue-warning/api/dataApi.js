import { request } from "@/service/AxiosService.js";

export function getSurveyWarningBySurveyAudit(id) {
  const url = `/api/v1/management/survey_warning/get-survey-warning-by-survey-audit-id/${id}`;
  return request("get", url, {}, true);
}
export function creatSurvetWarning(payload) {
  const url = `/api/v1/management/survey_warning/create-survey-warning`;
  return request("post", url, payload, true);
}
