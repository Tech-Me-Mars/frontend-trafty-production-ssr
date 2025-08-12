import { request } from "@/service/AxiosService.js";

// export async function getSurveyAuditByBusinessId(id) {
//   const modulepath = await getModulePathByRoleId()
//   const url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-by-business-id/${id}`;
//   return request("get", url, {}, true);
// }


export async function getBusiness(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business/${id}`;

  return request("get", url, {}, true);
}