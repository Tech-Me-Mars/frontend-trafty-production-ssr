import { request } from "@/service/AxiosService.js";

export async function getSurveyAuditAllByBusinessId(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-all-by-business-id/${id}`;
  return request("get", url, {}, true);
}


export async function updateSurveyStatusShow(id,payload) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/survey_audit/update-survey-audit-status-show/${id}`;
  return request("put", url, payload, true);
}
