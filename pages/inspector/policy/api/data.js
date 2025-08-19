import { request } from "@/service/AxiosService.js";

export function getSurveyAuditAllByBusinessId(id) {
  const url = `/api/v1/management/survey_audit/get-survey-audit-all-by-business-id/${id}`;
  return request("get", url, {}, true);
}


export function updateSurveyStatusShow(id,payload) {
  const url = `/api/v1/management/survey_audit/update-survey-audit-status-show/${id}`;
  return request("put", url, payload, true);
}
