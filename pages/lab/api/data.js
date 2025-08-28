

export function getNearPlace(payload) {
  const url = `/api/v1/management/business/get-places`;
  return request("post", url, payload, true);
}

