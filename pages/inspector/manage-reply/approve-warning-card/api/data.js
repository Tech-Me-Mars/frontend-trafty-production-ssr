import { request } from "@/service/AxiosService.js";


export function getSurveyWarningBySurveyWarningId(id) {
  const url = `/api/v1/management/survey_warning/get-survey-warning-by-survey-warning-id/${id}`;
  return request("get", url, {}, true);
}
export function updateSurveyWarningRespond(id,payload) {
  const url = `/api/v1/management/survey_warning_respond/${id}`;
  return request("put", url, payload, true);
}

