

export async function getSurveyWarningBySurveyAudit(id) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_warning/get-survey-warning-by-survey-audit-id/${id}`;
  return request("get", url, {}, true);
}
export async function creatSurvetWarning(payload) {
  const modulepath = await getModulePathByRoleName()

  const url = `/api/v1/${modulepath}/survey_warning/create-survey-warning`;
  return request("post", url, payload, true);
}
