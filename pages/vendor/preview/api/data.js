import { request } from "@/service/AxiosService.js";


export async function getBusinessById(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business/${id}`;
  return request("get", url, {}, true);
}

export function getProfile() {
  const url = `/api/auth/profile`;
  return request("get", url, {}, true);
}

export function getResultPoliceSurveyAudit() {
  const url = `/api/v1/survey-police/get-survey-audit-police-by-business-id/19`;
  return request("get", url, {}, true);
}



export function getComments(id) {
  const url = `/api/v1/business-comment/get-by-business-id/19`;
  return request("get", url, {}, true);
}