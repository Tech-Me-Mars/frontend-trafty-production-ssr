import { request } from "@/service/AxiosService.js";
import { useDecryptedCookie } from '@/composables/useEncryptedCookie';

export function getServiceType() {
  const url = `/api/v1/management/service_type`;
  return request("get", url, {}, true);
}

export function getBusinessType() {
  const url = `/api/v1/management/business_type`;
  return request("get", url, {}, true);
}
export function getBusinessTypeByServiceId(id) {
  const url = `/api/v1/business-type/by-service-type-id/${id}`;
  return request("get", url, {}, true);
}


export function getBusinessModel() {
  const url = `/api/v1/management/business_model`;
  return request("get", url, {}, true);
}

export function getSocialMedia() {
  const url = `/api/v1/management/social_media`;
  return request("get", url, {}, true);
}

export async function saveBusinessRegister(payload) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business`
  return request("post", url, payload, true)
}


export function getProvinces() {
  const url = `/api/v1/management/provinces`;
  return request("get", url, {}, true);
}

export function getDistrictByProvinceId(id) {
  const url = `/api/v1/management/district/get_by_provinces_id/${id}`;
  return request("get", url, {}, true);
}

export function getSubDistrictByDistrictId(id) {
  const url = `/api/v1/management/subdistrict/get_by_district_id/${id}`;
  return request("get", url, {}, true);
}

export async function getBusinessById(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business/${id}`;
  return request("get", url, {}, true);
}

export async function updateShopById(id,payload) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business/update-shop/${id}`;
  return request("put", url, payload, true);
}
export async function updateBusinessById(id,payload) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business/update-business/${id}`;
  return request("put", url, payload, true);
}

export async function deleteShopBank(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_document/delete-business-bank/${id}`;
  return request("delete", url, {}, true);
}
export async function deleteShopSocialMedia(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_social_media/${id}`;
  return request("delete", url, {}, true);
}
export async function deleteShopImg(id) {
  const modulepath = await getModulePathByRoleId()
  const url = `/api/v1/${modulepath}/business_img/${id}`;
  return request("delete", url, {}, true);
}



