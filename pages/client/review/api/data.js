import { request } from "@/service/AxiosService.js";

export function getTypeBusinessComment(payload) {
  const url = `/api/v1/business-comment/get-comment-by-business-id/`;
  return request("post", url, payload, true);
}

export function saveComment(payload) {
  const url = `/api/v1/business-comment`;
  return request("post", url, payload, true);
}