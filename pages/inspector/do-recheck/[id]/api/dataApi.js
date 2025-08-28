import { request } from "@/service/AxiosService.js";

export async function getSurveyAuditById(id) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-by-id/${id}`;
  return request("get", url, {}, true);
}
export async function saveSurveyAudit(payload) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_audit/create-survey-audit`;
  return request("post", url, payload, true);
}

