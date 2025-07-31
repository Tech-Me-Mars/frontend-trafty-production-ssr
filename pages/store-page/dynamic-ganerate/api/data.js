import { request } from "@/service/AxiosService.js";

// const runtimeConfig = useRuntimeConfig()
// console.log('runtimeConfig',runtimeConfig)
export function getSurveyById() {
  const url = `/api/v1/management/survey_audit/get-survey-by-id/e9c6c7ea-1beb-409c-ba73-e1143725999e`;
  return request("get", url, {}, true);
}
