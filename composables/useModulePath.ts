export async function getModulePathByRoleId(): Promise<string> {
    const role_id = await useDecryptedCookie("role_id")
  
    const mapping: Record<number, string> = {
      1: 'management',
      2: 'business',
      3: 'police',
      5: 'tourist'
    }
  
    return mapping[Number(role_id)] || ''
  }
  