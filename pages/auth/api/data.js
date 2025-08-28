

export function login(payload) {
  const url = `/api/auth/login`;
  return request("post", url, payload, false);
}
export function refreshToken(payload) {
  const url = `/api/auth/refresh`;
  return request("post", url, payload, true);
}


export function register(payload) {
  const url = `/api/auth/register`;
  return request("post", url, payload, false);
}
