import { request } from "@/service/AxiosService.js";


export async function getSurveyWarningAllByBusinessId(id) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_warning_respond/get-survey-warning-all-by-business-id/${id}`;
  return request("get", url, {}, true);
}
