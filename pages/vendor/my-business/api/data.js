import { request } from "@/service/AxiosService.js";


export async function getMyBusiness() {
  const modulepath = await getModulePathByRoleName()
  const url = `/api/v1/${modulepath}/business/get-business-by-user-id`;
  return request("get", url, {}, true);
}
