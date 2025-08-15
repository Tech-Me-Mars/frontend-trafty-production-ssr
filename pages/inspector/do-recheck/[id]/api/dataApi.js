import { request } from "@/service/AxiosService.js";

export function getSurveyAuditById(id) {
  const url = `/api/v1/management/survey_audit/get-survey-audit-by-id/${id}`;
  return request("get", url, {}, true);
}
export function saveSurveyAudit(payload) {
  const url = `/api/v1/management/survey_audit/create-survey-audit`;
  return request("post", url, payload, true);
}

