import { request } from "@/service/AxiosService.js";


export async function getSurveyAuditBusinessTouristWait() {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-business-tourist-wait`;
  return request("get", url, {}, true);
}
export async function getSurveyAuditBusinessTouristFinish() {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-business-tourist-finish`;
  return request("get", url, {}, true);
}
