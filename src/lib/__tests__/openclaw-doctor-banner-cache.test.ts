import { describe, expect, it } from 'vitest'
import {
  isOpenClawDoctorCacheFresh,
  parseOpenClawDoctorCache,
  serializeOpenClawDoctorCache,
  type OpenClawDoctorCacheEntry,
} from '@/lib/openclaw-doctor-banner-cache'

interface DoctorStatusFixture {
  healthy: boolean
}

describe('openclaw-doctor-banner-cache', () => {
  it('parses valid cache entry payloads', () => {
    const raw = JSON.stringify({ status: { healthy: false }, fetchedAt: 123 })
    const parsed = parseOpenClawDoctorCache<DoctorStatusFixture>(raw)

    expect(parsed).toEqual({ status: { healthy: false }, fetchedAt: 123 })
  })

  it('returns null for invalid payloads', () => {
    expect(parseOpenClawDoctorCache<DoctorStatusFixture>('not-json')).toBeNull()
    expect(parseOpenClawDoctorCache<DoctorStatusFixture>(JSON.stringify({}))).toBeNull()
    expect(parseOpenClawDoctorCache<DoctorStatusFixture>(JSON.stringify({ status: { healthy: true } }))).toBeNull()
  })

  it('marks cache fresh only inside cooldown window', () => {
    expect(isOpenClawDoctorCacheFresh(10_000, 10_500, 1_000)).toBe(true)
    expect(isOpenClawDoctorCacheFresh(10_000, 11_000, 1_000)).toBe(false)
    expect(isOpenClawDoctorCacheFresh(10_000, 12_000, 1_000)).toBe(false)
  })

  it('serializes cache entries to JSON', () => {
    const entry: OpenClawDoctorCacheEntry<DoctorStatusFixture> = {
      status: { healthy: true },
      fetchedAt: 42,
    }

    expect(serializeOpenClawDoctorCache(entry)).toBe('{"status":{"healthy":true},"fetchedAt":42}')
  })
})
