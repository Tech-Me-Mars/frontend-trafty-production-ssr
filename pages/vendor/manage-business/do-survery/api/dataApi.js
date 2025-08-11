import { request } from "@/service/AxiosService.js";

// const runtimeConfig = useRuntimeConfig()
// console.log('runtimeConfig',runtimeConfig)
export function getSurveyById(id) {
  const url = `/api/v1/management/survey_audit/get-survey-by-business-id/${id}`;
  return request("get", url, {}, true);
}
