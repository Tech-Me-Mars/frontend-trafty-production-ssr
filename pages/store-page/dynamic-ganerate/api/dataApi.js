import { request } from "@/service/AxiosService.js";

// const runtimeConfig = useRuntimeConfig()
// console.log('runtimeConfig',runtimeConfig)
export function getSurveyById() {
  const url = `/api/v1/management/survey_audit/get-survey-by-business-id/5b31c22d-71e8-4954-a965-7e8a0947782e`;
  return request("get", url, {}, true);
}
