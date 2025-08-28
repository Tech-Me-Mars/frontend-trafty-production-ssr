

export function getNotificationPolice() {
  const url = `/api/v1/notications/notifications-policet`;
  return request("get", url, {}, true);
}
