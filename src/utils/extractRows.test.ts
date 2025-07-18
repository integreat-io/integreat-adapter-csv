import test from 'node:test'
import assert from 'node:assert/strict'

import extractRows from './extractRows.js'

// Tests

test('should extract rows from an array of objects according to the given columns', () => {
  const data = [
    { col1: 'John F.', col2: 45, col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: 52, col3: 'Kvølstadbakken 11' },
    { col1: 'Simon P.', col2: 23, col3: 'Praiestakken 21A' },
  ]
  const columns: [string, string][] = [
    ['col1', 'col1'],
    ['col2', 'col2'],
    ['col3', 'col3'],
  ]
  const expected = [
    ['John F.', 45, 'Fjonveien 18'],
    ['Mary K.', 52, 'Kvølstadbakken 11'],
    ['Simon P.', 23, 'Praiestakken 21A'],
  ]

  const ret = extractRows(data, columns)

  assert.deepEqual(ret, expected)
})

test('should extract rows from an array of unequal objects', () => {
  const data = [
    { col2: 45, col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col3: 'Kvølstadbakken 11' },
    { col4: 'Simon P.', col2: 23, col3: 'Praiestakken 21A' },
  ]
  const columns: [string, string][] = [
    ['col1', 'col1'],
    ['col2', 'col2'],
    ['col3', 'col3'],
    ['col4', 'col4'],
  ]
  const expected = [
    [undefined, 45, 'Fjonveien 18', undefined],
    ['Mary K.', undefined, 'Kvølstadbakken 11', undefined],
    [undefined, 23, 'Praiestakken 21A', 'Simon P.'],
  ]

  const ret = extractRows(data, columns)

  assert.deepEqual(ret, expected)
})

test('should expand array values', () => {
  const data = [
    { col1: ['John F.', 'Lucy C.'], col2: 45, col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: 52, col3: 'Kvølstadbakken 11' },
    {
      col1: ['Simon P.', 'Benny G.', 'Frank P.'],
      col2: 23,
      col3: 'Praiestakken 21A',
    },
  ]
  const columns: ([string, string] | undefined)[] = [
    ['col1', 'col1'],
    undefined,
    undefined,
    ['col2', 'col2'],
    ['col3', 'col3'],
  ]
  const expected = [
    ['John F.', 'Lucy C.', undefined, 45, 'Fjonveien 18'],
    ['Mary K.', undefined, undefined, 52, 'Kvølstadbakken 11'],
    ['Simon P.', 'Benny G.', 'Frank P.', 23, 'Praiestakken 21A'],
  ]

  const ret = extractRows(data, columns)

  assert.deepEqual(ret, expected)
})

test('should return empty array when data is empty', () => {
  const data: Record<string, string | number | undefined>[] = []
  const columns: [string, string][] = [
    ['col1', 'col1'],
    ['col2', 'col2'],
  ]
  const expected: (string | number | undefined)[][] = []

  const ret = extractRows(data, columns)

  assert.deepEqual(ret, expected)
})

test('should return array of empty arrays when columns is empty', () => {
  const data = [
    { col1: 'John F.', col2: 45 },
    { col1: 'Mary K.', col2: 52 },
  ]
  const columns: [string, string][] = []
  const expected = [[], []]

  const ret = extractRows(data, columns)

  assert.deepEqual(ret, expected)
})

test('should handle data with explicit undefined values', () => {
  const data = [
    { col1: 'John F.', col2: undefined, col3: 'Address' },
    { col1: undefined, col2: 45, col3: undefined },
  ]
  const columns: [string, string][] = [
    ['col1', 'col1'],
    ['col2', 'col2'],
    ['col3', 'col3'],
  ]
  const expected = [
    ['John F.', undefined, 'Address'],
    [undefined, 45, undefined],
  ]

  const ret = extractRows(data, columns)

  assert.deepEqual(ret, expected)
})

test('should extract same column multiple times when column id is duplicated', () => {
  const data = [
    { col1: 'John F.', col2: 45 },
    { col1: 'Mary K.', col2: 52 },
  ]
  const columns: [string, string][] = [
    ['col1', 'col1'],
    ['col2', 'col2'],
    ['col1', 'col1_duplicate'],
  ]
  const expected = [
    ['John F.', 45, 'John F.'],
    ['Mary K.', 52, 'Mary K.'],
  ]

  const ret = extractRows(data, columns)

  assert.deepEqual(ret, expected)
})

test('should preserve column order regardless of data object key order', () => {
  const data = [{ col3: 'Address', col1: 'John F.', col2: 45 }]
  const columns: [string, string][] = [
    ['col2', 'col2'],
    ['col1', 'col1'],
    ['col3', 'col3'],
  ]
  const expected = [[45, 'John F.', 'Address']]

  const ret = extractRows(data, columns)

  assert.deepEqual(ret, expected)
})

test('should skip fields not given in the columns array', () => {
  const data = [{ col4: 'Simon P.', col2: 23, col3: 'Praiestakken 21A' }]
  const columns: [string, string][] = [
    ['col1', 'col1'],
    ['col2', 'col2'],
    ['col3', 'col3'],
  ]
  const expected = [[undefined, 23, 'Praiestakken 21A']]

  const ret = extractRows(data, columns)

  assert.deepEqual(ret, expected)
})
