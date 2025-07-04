import { request } from "@/service/AxiosService.js";

export function getBusinessType() {
  const url = `/api/v1/business-type`;
  return request("get", url, {}, true);
}

export function getRecommendPlace() {
  const url = `/api/v1/business/recommend-place`;
  return request("get", url, {}, true);
}

export function getHotPlace() {
  const url = `/api/v1/business/hot-place`;
  return request("get", url, {}, true);
}

export function getNearPlace() {
  const url = `/api/v1/business/near-place`;
  return request("get", url, {}, true);
}
