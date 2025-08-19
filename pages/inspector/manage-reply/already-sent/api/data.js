import { request } from "@/service/AxiosService.js";


export function getSurveyWarningAllByBusinessId(id) {
  const url = `/api/v1/management/survey_warning_respond/get-survey-warning-all-by-business-id/${id}`;
  return request("get", url, {}, true);
}
