

export function getReccommendAll() {
  const url = `/api/v1/business/recommend-place-all`;
  return request("get", url, {}, false);
}

