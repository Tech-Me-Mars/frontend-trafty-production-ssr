export async function getModulePathByRoleName(): Promise<string> {
  // อาจได้เป็น string หรือ Ref<string|null> ขึ้นกับ implement ของ useDecryptedCookie
  const roleNameRaw: unknown = await useDecryptedCookie('role_name')

  const roleName =
    typeof roleNameRaw === 'string'
      ? roleNameRaw
      : (roleNameRaw as any)?.value ?? '' // รองรับกรณีเป็น Ref

  const key = String(roleName).trim().toLowerCase()

  const mapping: Record<string, string> = {
    admin: 'management',
    business: 'business',
    police: 'police',
    tourist: 'tourist',
  }

  return mapping[key] ?? ''
}
