import { request } from "@/service/AxiosService.js";

// const runtimeConfig = useRuntimeConfig()
// console.log('runtimeConfig',runtimeConfig)
export async function getSurveyById(id) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_audit/get-survey-by-business-id/${id}`;
  return request("get", url, {}, true);
}
export async function saveSurvey(payload) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_audit/create-survey-audit`;
  return request("post", url, payload, true);
}
