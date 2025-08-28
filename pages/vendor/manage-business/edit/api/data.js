import { request } from "@/service/AxiosService.js";
import { useDecryptedCookie } from '@/composables/useEncryptedCookie';

export async function getServiceType() {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/service_type`;
  return request("get", url, {}, true);
}

export async function getBusinessType() {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/business_type`;
  return request("get", url, {}, true);
}


export async function getBusinessModel() {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business_model`;
  return request("get", url, {}, true);
}

export async function getSocialMedia() {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/social_media`;
  return request("get", url, {}, true);
}

export async function saveBusinessRegister(payload) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business`
  return request("post", url, payload, true)
}


export async function getProvinces() {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/provinces`;
  return request("get", url, {}, true);
}

export async function getDistrictByProvinceId(id) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/district/get_by_provinces_id/${id}`;
  return request("get", url, {}, true);
}

export async function getSubDistrictByDistrictId(id) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/subdistrict/get_by_district_id/${id}`;
  return request("get", url, {}, true);
}

export async function getBusinessById(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business/${id}`;
  return request("get", url, {}, true);
}

export async function updateShopById(id,payload) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business/update-shop/${id}`;
  return request("put", url, payload, true);
}
export async function updateBusinessById(id,payload) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business/update-business/${id}`;
  return request("put", url, payload, true);
}

export async function deleteShopBank(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business_document/delete-business-bank/${id}`;
  return request("delete", url, {}, true);
}
export async function deleteShopSocialMedia(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business_social_media/${id}`;
  return request("delete", url, {}, true);
}
export async function deleteShopImg(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business_img/${id}`;
  return request("delete", url, {}, true);
}

export async function deletDocment(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business_document/${id}`;
  return request("delete", url, {}, true);
}




