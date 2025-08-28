import { request } from "@/service/AxiosService.js";

// const runtimeConfig = useRuntimeConfig()
// console.log('runtimeConfig',runtimeConfig)
export async function getSurveyAuditPass(id) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-pass-by-business-id/${id}`;
  return request("get", url, {}, true);
}

export async function getSurveyAuditFail(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-failed-by-business-id/${id}`;
  return request("get", url, {}, true);
}
