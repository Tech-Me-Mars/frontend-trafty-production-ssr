import { request } from "@/service/AxiosService.js";

export function getWarningResponPolice() {
  const url = `/api/v1/survey-warning-respond/get-survey-warning-respond-police`;
  return request("get", url, {}, true);
}


export function getBusinessWarningSuccess() {
  const url = `/api/v1/survey-waiting/get-survey-warning-succeed`;
  return request("get", url, {}, true);
}


export function getBusinessWarningSuccessDetail(business_id) {
  const url = `/api/v1/survey-waiting/get-survey-warning-succeed-details_list/${business_id}`;
  return request("get", url, {}, true);
}