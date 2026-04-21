export function generateInviteLink(inviteCode: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '')
  return `${base}/join/${inviteCode}`
}

export function extractInviteCode(pathname: string): string | null {
  const match = pathname.match(/^\/join\/([A-Z0-9]+)$/)
  return match ? match[1] : null
}
