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


export async function getBusinessList(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_list/${id}`;
  return request("get", url, {}, true);
}



export async function deleteBusinessId(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_list/${id}`;
  return request("delete", url, {}, true);
}


export async function updateBusiness(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_list/${id}`;
  return request("put", url, {}, true);
}


export async function updateBusinessStatus(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_list/update-status/${id}`;
  return request("put", url, {}, true);
}

