import { request } from "@/service/AxiosService.js";


export function getSurveyAuditBusinessTouristWait() {
  const url = `/api/v1/management/survey_audit/get-survey-audit-business-tourist-wait`;
  return request("get", url, {}, true);
}
export function getSurveyAuditBusinessTouristFinish() {
  const url = `/api/v1/management/survey_audit/get-survey-audit-business-tourist-finish`;
  return request("get", url, {}, true);
}
