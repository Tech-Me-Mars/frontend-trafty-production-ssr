import { request } from "@/service/AxiosService.js";

export async function getBusinessList(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_list/get-business-list-by-business-id/${id}`;
  // get-business-list-by-business-id
  return request("get", url, {}, true);
}
export async function deleteBusinessId(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_list/${id}`;
  return request("delete", url, {}, true);
}


export async function updateBusiness(id,payload) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_list/${id}`;
  return request("put", url, payload, true);
}


export async function updateBusinessStatus(id,payload) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_list/update-status/${id}`;
  return request("put", url, payload, true);
}

export async function createBusinessList(payload) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_list`;
  return request("post", url, payload, true);
}

