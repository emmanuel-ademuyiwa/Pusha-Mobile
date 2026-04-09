/**
 * After login, use `user.business` (nested business record with `id`) to know if setup is done.
 * If `business` is missing or has no `id`, send the user to setup-business (app) or onboarding (web).
 * Root-level `business_id` is still accepted when present.
 */
export function needsBusinessOnboarding(
  user: {
    business?: {id?: string | null; [key: string]: unknown} | null
    business_id?: string | null
  } | null | undefined
): boolean {
  if (!user) return true

  const rootId = user.business_id
  if (rootId != null && String(rootId).trim() !== '') {
    return false
  }

  const b = user.business
  if (b == null || typeof b !== 'object' || Array.isArray(b)) {
    return true
  }

  const bid = (b as {id?: string | null}).id
  if (bid != null && String(bid).trim() !== '') {
    return false
  }

  return true
}
