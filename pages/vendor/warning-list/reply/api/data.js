



export async function getSurveyWarningBySurveyAuditId(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/survey_warning/get-survey-warning-by-survey-warning-id/${id}`;
  return request("get", url, {}, true);
}

export async function creatSurveyWarningRespond(payload) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/survey_warning_respond/create-survey-warning-respond`;
  return request("post", url, payload, true);
}

