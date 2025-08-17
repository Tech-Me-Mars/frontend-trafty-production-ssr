import { request } from "@/service/AxiosService.js";



export async function getSurveyWarningBySurveyAuditId(id) {
  const url = `/api/v1/management/survey_warning/get-survey-warning-by-survey-audit-id/${id}`;
  return request("get", url, {}, true);
}
