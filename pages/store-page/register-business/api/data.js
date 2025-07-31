import { request } from "@/service/AxiosService.js";

export function getServiceType() {
  const url = `/api/v1/service-type`;
  return request("get", url, {}, true);
}

export function getBusinessType() {
  const url = `/api/v1/business-type`;
  return request("get", url, {}, true);
}
export function getBusinessTypeByServiceId(id) {
  const url = `/api/v1/business-type/by-service-type-id/${id}`;
  return request("get", url, {}, true);
}


export function getBusinessModel() {
  const url = `/api/v1/BusinessModel`;
  return request("get", url, {}, true);
}

export function getSocialMedia() {
  const url = `/api/v1/social-media`;
  return request("get", url, {}, true);
}

export function saveBusinessRegister(payload) {
  const url = `/api/v1/business/business-register`;
  return request("post", url, payload, true);
}
