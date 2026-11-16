import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCompare, serializeCompare, updateCompareSlot } from '../src/lib/compareState.js'

test('the second picker works without a first selection', () => {
  const selected = updateCompareSlot([], 1, 'B02')
  assert.deepEqual(selected, ['', 'B02'])
  assert.deepEqual(parseCompare(serializeCompare(selected)), selected)
})

test('clearing first does not silently move second into first', () => {
  const selected = updateCompareSlot(['M01', 'B02'], 0, '')
  assert.deepEqual(selected, ['', 'B02'])
  assert.deepEqual(parseCompare(serializeCompare(selected)), selected)
})

test('clearing second retains first, clearing both removes URL state', () => {
  const onlyFirst = updateCompareSlot(['M01', 'B02'], 1, '')
  assert.deepEqual(onlyFirst, ['M01', ''])
  assert.deepEqual(parseCompare(serializeCompare(onlyFirst)), ['M01', ''])
  assert.deepEqual(updateCompareSlot(onlyFirst, 0, ''), [])
  assert.equal(serializeCompare([]), null)
})

test('existing direct links remain valid and malformed extras are ignored', () => {
  assert.deepEqual(parseCompare('M01,B02'), ['M01', 'B02'])
  assert.deepEqual(parseCompare('M01'), ['M01'])
  assert.deepEqual(parseCompare('M01,B02,EXTRA'), ['M01', 'B02'])
  assert.deepEqual(parseCompare(''), [])
  assert.deepEqual(parseCompare(null), [])
})

test('invalid comparison slot does not mutate current selection', () => {
  const current = ['M01', 'B02']
  assert.throws(() => updateCompareSlot(current, 2, 'A01'), RangeError)
  assert.deepEqual(current, ['M01', 'B02'])
})


test('light and dark theme tokens meet normal-text contrast for informative labels and badges', async () => {
  const { readFileSync } = await import('node:fs')
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
  const themes = {
    light: css.match(/:root\\s*\\{([^}]+)\\}/)?.[1],
    dark: css.match(/\\[data-theme="dark"\\]\\s*\\{([^}]+)\\}/)?.[1],
  }
  const channel = value => {
    const normalized = value / 255
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  }
  const luminance = hex => {
    assert.match(hex, /^#[0-9a-f]{6}$/i)
    const channels = [1, 3, 5].map(i => channel(parseInt(hex.slice(i, i + 2), 16)))
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  }
  const contrast = (a, b) => {
    const values = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (values[0] + 0.05) / (values[1] + 0.05)
  }
  const pairs = [
    ['text', 'bg'], ['muted', 'bg'], ['hint', 'bg'], ['hint', 'surface'],
    ['gold', 'surface'], ['hi', 'hibg'], ['med', 'medbg'], ['lo', 'lobg'],
    ['navy', 'surface'], ['chip-on-text', 'navy'], ['quick-on-text', 'quick-selected'],
  ]
  for (const [theme, block] of Object.entries(themes)) {
    assert.ok(block, theme + ' theme variables exist')
    const tokens = Object.fromEntries([...block.matchAll(/--([a-z-]+):\\s*(#[0-9a-f]{6})\\s*(?:;|$)/gi)]
      .map(([, name, value]) => [name, value]))
    for (const [foreground, background] of pairs) {
      assert.ok(tokens[foreground] && tokens[background], theme + ' has ' + foreground + ' and ' + background)
      const ratio = contrast(tokens[foreground], tokens[background])
      assert.ok(ratio >= 4.5, theme + ' ' + foreground + '/' + background + ' contrast ' + ratio.toFixed(2) + ':1')
    }
  }
})
