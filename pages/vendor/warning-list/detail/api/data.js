

export async function getSurveyWarningRespondBySurVeyWarningId(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/survey_warning_respond/get-survey-warning-respond-by-survey-warning-id/${id}`;
  return request("get", url, {}, true);
}



