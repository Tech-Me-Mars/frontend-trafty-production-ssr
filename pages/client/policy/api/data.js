import { request } from "@/service/AxiosService.js";

export function getResultPoliceSurveyAudit(id) {
  const url = `/api/v1/survey-police/get-survey-audit-police-by-business-id/${id}`;
  return request("get", url, {}, true);
}

