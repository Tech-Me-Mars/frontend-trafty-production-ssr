


export async function getSurveyWarningBySurveyWarningId(id) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_warning/get-survey-warning-by-survey-warning-id/${id}`;
  return request("get", url, {}, true);
}
export async function updateSurveyWarningRespond(id,payload) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_warning_respond/${id}`;
  return request("put", url, payload, true);
}

