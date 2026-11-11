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
