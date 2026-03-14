/**
 * Cached payload shape for OpenClaw doctor banner status.
 */
export interface OpenClawDoctorCacheEntry<T> {
  status: T
  fetchedAt: number
}

/**
 * Parse serialized cache entry safely.
 */
export function parseOpenClawDoctorCache<T>(raw: string | null): OpenClawDoctorCacheEntry<T> | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<OpenClawDoctorCacheEntry<T>>
    if (!parsed || typeof parsed.fetchedAt !== 'number' || !('status' in parsed)) return null
    return { status: parsed.status as T, fetchedAt: parsed.fetchedAt }
  } catch {
    return null
  }
}

/**
 * Return true when cached value is still usable.
 */
export function isOpenClawDoctorCacheFresh(fetchedAt: number, now: number, cooldownMs: number): boolean {
  return now - fetchedAt < cooldownMs
}

/**
 * Serialize cache entry for session storage.
 */
export function serializeOpenClawDoctorCache<T>(entry: OpenClawDoctorCacheEntry<T>): string {
  return JSON.stringify(entry)
}
