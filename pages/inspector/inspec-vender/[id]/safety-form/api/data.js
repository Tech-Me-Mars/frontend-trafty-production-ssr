import { request } from "@/service/AxiosService.js";

export function getBusinessById(id) {
  const url = `/api/v1/business/${id}`;
  return request("get", url, {}, true);
}


export function getProfile() {
  const url = `/api/auth/profile`;
  return request("get", url, {}, true);
}

export function geySurveyBuId(id) {
  const url = `/api/v1/survey/get-survey/${id}`;
  return request("get", url, {}, true);
}

export function saveSurveyAudit(payload) {
  const url = `/api/v1/survey-police/save-survey-police`;
  return request("post", url, payload, true);
}

export function geyTimeSurvey(id) {
  const url = `/api/v1/survey-police/get-survey-audit-police-by-survey-audit-police-id/${id}`;
  return request("get", url, {}, true);
}

export function geyVendorSurveyByBusinessId(id) {
  const url = `/api/v1/survey/get-survey-audit-by-business-id/${id}`;
  return request("get", url, {}, true);
}
