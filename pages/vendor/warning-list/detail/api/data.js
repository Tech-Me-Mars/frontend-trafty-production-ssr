import { request } from "@/service/AxiosService.js";

export async function getSurveyWarningRespondBySurVeyWarningId(id) {
  const url = `/api/v1/management/survey_warning_respond/get-survey-warning-respond-by-survey-warning-id/${id}`;
  return request("get", url, {}, true);
}



