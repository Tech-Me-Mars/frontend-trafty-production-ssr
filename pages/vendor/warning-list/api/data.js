import { request } from "@/service/AxiosService.js";



export async function getFinisgSurveyWarning() {
  // const modulepath = await getModulePathByRoleName()
  const url = `api/v1/management/survey_warning/get-survey-warning-finish-by-user-id`;

  return request("get", url, {}, true);
}

export async function getwaitSurveyWarning() {
  // const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/management/survey_warning/get-survey-warning-wait-by-user-id`;

  return request("get", url, {}, true);
}
