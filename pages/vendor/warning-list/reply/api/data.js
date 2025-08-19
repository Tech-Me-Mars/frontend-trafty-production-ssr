import { request } from "@/service/AxiosService.js";



export async function getSurveyWarningBySurveyAuditId(id) {
  const url = `/api/v1/management/survey_warning/get-survey-warning-by-survey-warning-id/${id}`;
  return request("get", url, {}, true);
}

export async function creatSurveyWarningRespond(payload) {
  const url = `/api/v1/management/survey_warning_respond/create-survey-warning-respond`;
  return request("post", url, payload, true);
}

