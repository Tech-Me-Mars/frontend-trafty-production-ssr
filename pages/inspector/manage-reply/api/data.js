import { request } from "@/service/AxiosService.js";


export async function getSurveyWarningByStation() {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_warning/get-survey-warning-by-station`;
  return request("get", url, {}, true);
}
export async function getSurveyWarningResponseByStation() {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_warning_respond/get-survey-warning-respond-by-station`;
  return request("get", url, {}, true);
}
