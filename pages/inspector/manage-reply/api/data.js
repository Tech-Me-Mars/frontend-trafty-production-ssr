import { request } from "@/service/AxiosService.js";


export function getSurveyWarningByStation() {
  const url = `/api/v1/management/survey_warning/get-survey-warning-by-station`;
  return request("get", url, {}, true);
}
export function getSurveyWarningResponseByStation() {
  const url = `/api/v1/management/survey_warning_respond/get-survey-warning-respond-by-station`;
  return request("get", url, {}, true);
}
