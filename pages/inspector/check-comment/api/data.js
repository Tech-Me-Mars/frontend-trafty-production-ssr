// ./api/data.js
import { request } from '@/service/AxiosService' // ปรับ path ให้ตรงโปรเจกต์

// GET คอมเมนต์ตามระดับดาว (0 = ทั้งหมด)
export const getCommentByStar = (star = 0) => {
  return request('GET', `/api/v1/management/business_comment/get-comment-by-star/${star}`,{},true);
};

// อัปเดตสถานะการแสดงผลของคอมเมนต์
export const updateCommentVisibility = (commentId, status) => {
  // status อาจถูกส่งมาเป็น boolean หรือ object ก็ได้
  const payload = typeof status === 'object' ? status : { status: !!status };
  // พาราม 'true' ตัวที่ 4 = ให้ส่ง auth header (ตาม convention โปรเจกต์คุณ)
  return request('PUT', `/api/v1/management/business_comment/${commentId}`, payload, true);
};
