import { request } from "@/service/AxiosService.js";

export function getBusinessById(id) {
  const url = `/api/v1/business/${id}`;
  return request("get", url, {}, true);
}

export function getProfile() {
  const url = `/api/auth/profile`;
  return request("get", url, {}, true);
}

export function getResultPoliceSurveyAudit(id) {
  const url = `/api/v1/survey-police/get-survey-audit-police-by-business-id/${id}`;
  return request("get", url, {}, true);
}



export function getComments(id) {
  const url = `/api/v1/business-comment/get-by-business-id/${id}`;
  return request("get", url, {}, true);
}