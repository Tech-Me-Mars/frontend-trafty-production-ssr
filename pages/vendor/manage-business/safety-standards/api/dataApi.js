import { request } from "@/service/AxiosService.js";

// const runtimeConfig = useRuntimeConfig()
// console.log('runtimeConfig',runtimeConfig)
export function getSurveyAuditPass(id) {
  const url = `/api/v1/management/survey_audit/get-survey-audit-pass-by-business-id/${id}`;
  return request("get", url, {}, true);
}

export function getSurveyAuditFail(id) {
  const url = `/api/v1/management/survey_audit/get-survey-audit-failed-by-business-id/${id}`;
  return request("get", url, {}, true);
}
