import { describe, expect, test } from 'bun:test'

import { parsePackingProgress } from './packing-progress'

describe('saved packing progress', () => {
  const itemIds = ['0-0', '0-1']

  test('restores only a valid list of checklist IDs', () => {
    expect(parsePackingProgress('["0-0", "0-0", "0-1"]', itemIds)).toEqual(
      new Set(itemIds),
    )
    expect(parsePackingProgress('[]', itemIds)).toEqual(new Set())
  })

  test('rejects malformed data instead of counting nonexistent checked items', () => {
    for (const saved of ['"bad"', '{}', 'null', '[1]', '["old-item"]', '{']) {
      expect(() => parsePackingProgress(saved, itemIds)).toThrow()
    }
  })
})
