

export function searchBusinessByname(name) {
  const url = `/api/v1/business/get-business-by-name/${name}`;
  return request("get", url, {}, true);
}
