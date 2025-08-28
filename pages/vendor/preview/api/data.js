


export async function getBusinessById(id) {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business/${id}`;
  return request("get", url, {}, true);
}

export function getProfile() {
  const url = `/api/auth/profile`;
  return request("get", url, {}, true);
}

export async function getSurveyAuditAllByBusinessId(id) {
    const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-all-by-business-id/${id}`;
  return request("get", url, {}, true);
}



export function getComments(id) {
  const url = `/api/v1/business-comment/get-by-business-id/19`;
  return request("get", url, {}, true);
}