import { request } from "@/service/AxiosService.js";

// export async function getSurveyAuditByBusinessId(id) {
//   const modulepath = await getModulePathByRoleName()
//   const url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-by-business-id/${id}`;
//   return request("get", url, {}, true);
// }


export async function getBusiness(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business/${id}`;

  return request("get", url, {}, true);
}


export async function getBusinessList(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business_list/${id}`;
  return request("get", url, {}, true);
}



export async function deleteBusinessId(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business_list/${id}`;
  return request("delete", url, {}, true);
}


export async function updateBusiness(id,payload) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business_list/${id}`;
  return request("put", url, payload, true);
}


export async function updateBusinessStatus(id,payload) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business_list/update-status/${id}`;
  return request("put", url, payload, true);
}

export async function getResponsiblePerson() {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business/get_responsible`;
  return request("get", url, {}, true);
}

export async function updateBusinessResponsible(id,payload) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business/update-business-responsible/${id}`;
  return request("put", url, payload, true);
}

