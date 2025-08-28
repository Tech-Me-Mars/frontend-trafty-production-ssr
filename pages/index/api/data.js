import { request } from "@/service/AxiosService.js";

export function getBusinessType() {
  const url = `/api/v1/management/business_type`;
  return request("get", url, {}, true);
}


export function getPlaceNearKeyWord(payload) {
  const url = `/api/place/get-places-near-keyword`;
  return request("post", url, payload, true);
}

export function getPlaceNearByBusinessTypeId(payload) {
  const url = `/api/place/get-places-near-by-business-type-id`;
  return request("post", url, payload, false);
}
export function getPlaceNearRecommended(payload) {
  const url = `/api/place/get-places-near-recommended`;
  return request("post", url, payload, false);
}

export function getPlaceNearPopular(payload) {
  const url = `/api/place/get-places-near-popular`;
  return request("post", url, payload, false);
}

export function getPlaceNear() {
  const url = `/api/place/get-places-near`;
  return request("post", url, payload, false);
}