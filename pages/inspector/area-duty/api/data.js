


export async function getAreaStationTouristByUserID() {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/station/get-area-tourist-by-user-id`;
  return request("get", url, {}, true);
}

export async function getAreaStationBusinessTouristByUserID() {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/station/get-area-business-tourist-by-user-id`;
  return request("get", url, {}, true);
}