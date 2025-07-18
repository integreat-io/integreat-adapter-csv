import test from 'node:test'
import assert from 'node:assert/strict'

import extractColumns from './extractColumns.js'

// Tests

test('should extract columns from an array of objects', () => {
  const data = [
    { col1: 'John F.', col2: 45, col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: 52, col3: 'Kvølstadbakken 11' },
    { col1: 'Simon P.', col2: 23, col3: 'Praiestakken 21A' },
  ]
  const expected = [
    ['col1', 'col1'],
    ['col2', 'col2'],
    ['col3', 'col3'],
  ]

  const ret = extractColumns(data)

  assert.deepEqual(ret, expected)
})

test('should extract columns from an array of unequal objects', () => {
  const data = [
    { col2: '45', col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col3: 'Kvølstadbakken 11' },
    { col4: 'Simon P.', col2: 23, col3: 'Praiestakken 21A' },
  ]
  const expected = [
    ['col2', 'col2'],
    ['col3', 'col3'],
    ['col1', 'col1'],
    ['col4', 'col4'],
  ]

  const ret = extractColumns(data)

  assert.deepEqual(ret, expected)
})

test('should order columns by removing the prefix and order by the remaining number', () => {
  const prefix = 'col'
  const data = [
    { col2: '45', col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col3: 'Kvølstadbakken 11' },
    { col4: 'Simon P.', col2: 23, col3: 'Praiestakken 21A' },
  ]
  const expected = [
    ['col1', 'col1'],
    ['col2', 'col2'],
    ['col3', 'col3'],
    ['col4', 'col4'],
  ]

  const ret = extractColumns(data, prefix)

  assert.deepEqual(ret, expected)
})

test('should use column headers provided with columnHeaders', () => {
  const columnHeaders = {
    col1: 'Name',
    col2: 'Age',
    col3: 'Address',
    col4: 'Spouse',
  }
  const data = [
    { col2: '45', col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col3: 'Kvølstadbakken 11' },
    { col4: 'Simon P.', col2: 23, col3: 'Praiestakken 21A' },
  ]
  const expected = [
    ['col1', 'Name'],
    ['col2', 'Age'],
    ['col3', 'Address'],
    ['col4', 'Spouse'],
  ]

  const ret = extractColumns(data, undefined, columnHeaders)

  assert.deepEqual(ret, expected)
})

test('should keep all columnHeaders even if they do not exist in the data', () => {
  const columnHeaders = {
    col1: 'Name',
    col2: 'Age',
    col3: 'Address',
    col4: 'Spouse',
  }
  const data = [
    { col2: '45', col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col3: 'Kvølstadbakken 11' },
  ]
  const expected = [
    ['col1', 'Name'],
    ['col2', 'Age'],
    ['col3', 'Address'],
    ['col4', 'Spouse'],
  ]

  const ret = extractColumns(data, undefined, columnHeaders)

  assert.deepEqual(ret, expected)
})

test('should make room for array values to expand, by inserting empty columns', () => {
  const data = [
    { col1: ['John F.', 'Lucy C.'], col2: 45, col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: 52, col3: 'Kvølstadbakken 11' },
    { col1: 'Simon P.', col2: 23, col3: 'Praiestakken 21A' },
  ]
  const expected = [
    ['col1', 'col1'],
    undefined,
    ['col2', 'col2'],
    ['col3', 'col3'],
  ]

  const ret = extractColumns(data)

  assert.deepEqual(ret, expected)
})

test('should make room for array values to expand when providing column headers too', () => {
  const columnHeaders = {
    col1: 'Name',
    col2: 'Age',
    col3: 'Address',
  }
  const data = [
    { col1: ['John F.', 'Lucy C.'], col2: 45, col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: 52, col3: 'Kvølstadbakken 11' },
    { col1: 'Simon P.', col2: 23, col3: 'Praiestakken 21A' },
  ]
  const expected = [
    ['col1', 'Name'],
    undefined,
    ['col2', 'Age'],
    ['col3', 'Address'],
  ]

  const ret = extractColumns(data, undefined, columnHeaders)

  assert.deepEqual(ret, expected)
})

test('should make room for array values to expand, accounting for the largest array', () => {
  const data = [
    { col1: ['John F.', 'Lucy C.'], col2: 45, col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: 52, col3: 'Kvølstadbakken 11' },
    {
      col1: ['Simon P.', 'Benny G.', 'Frank P.'],
      col2: 23,
      col3: 'Praiestakken 21A',
    },
  ]
  const expected = [
    ['col1', 'col1'],
    undefined,
    undefined,
    ['col2', 'col2'],
    ['col3', 'col3'],
  ]

  const ret = extractColumns(data)

  assert.deepEqual(ret, expected)
})

test('should handle empty data array', () => {
  const data: Record<string, string | number | undefined>[] = []
  const expected: [string, string][] = []

  const ret = extractColumns(data)

  assert.deepEqual(ret, expected)
})

test('should handle data with empty objects', () => {
  const data = [{}, { col1: 'value1' }, {}, { col2: 'value2' }]
  const expected = [
    ['col1', 'col1'],
    ['col2', 'col2'],
  ]

  const ret = extractColumns(data)

  assert.deepEqual(ret, expected)
})

test('should handle mixed prefix scenarios with numeric and non-numeric suffixes', () => {
  const prefix = 'col'
  const data = [{ col1: 'value', colA: 'text', col2: 'value2', other: 'data' }]
  const expected = [
    ['col1', 'col1'],
    ['col2', 'col2'],
    ['colA', 'colA'],
    ['other', 'other'],
  ]

  const ret = extractColumns(data, prefix)

  assert.deepEqual(ret, expected)
})

test('should properly sort numeric columns (not lexicographically)', () => {
  const prefix = 'col'
  const data = [{ col10: 'ten', col2: 'two', col1: 'one', col20: 'twenty' }]
  const expected = [
    ['col1', 'col1'],
    ['col2', 'col2'],
    ['col10', 'col10'],
    ['col20', 'col20'],
  ]

  const ret = extractColumns(data, prefix)

  assert.deepEqual(ret, expected)
})

test('should handle columns with leading zeros', () => {
  const prefix = 'col'
  const data = [
    { col3: 'three', col02: 'zero-two', col01: 'zero-one', col1: 'one' },
  ]
  const expected = [
    ['col01', 'col01'],
    ['col1', 'col1'],
    ['col02', 'col02'],
    ['col3', 'col3'],
  ]

  const ret = extractColumns(data, prefix)

  assert.deepEqual(ret, expected)
})

test('should handle prefix that matches entire column name', () => {
  const prefix = 'col'
  const data = [{ col: 'value', col1: 'value1', column: 'value2' }]
  const expected = [
    ['col1', 'col1'],
    ['col', 'col'],
    ['column', 'column'],
  ]

  const ret = extractColumns(data, prefix)

  assert.deepEqual(ret, expected)
})

test('should handle empty string prefix', () => {
  const prefix = ''
  const data = [{ '1': 'one', '2': 'two', a: 'letter' }]
  const expected = [
    ['1', '1'],
    ['2', '2'],
    ['a', 'a'],
  ]

  const ret = extractColumns(data, prefix)

  assert.deepEqual(ret, expected)
})

test('should handle columns with non-integer numeric suffixes', () => {
  const prefix = 'col'
  const data = [{ 'col1.5': 'decimal', col1: 'integer', col1a: 'alphanumeric' }]
  const expected = [
    ['col1', 'col1'],
    ['col1.5', 'col1.5'],
    ['col1a', 'col1a'],
  ]

  const ret = extractColumns(data, prefix)

  assert.deepEqual(ret, expected)
})

test('should extract columns not matching the prefix', () => {
  const prefix = 'col'
  const data = [
    { Age: '45', Address: 'Fjonveien 18' },
    { Name: 'Mary K.', Address: 'Kvølstadbakken 11' },
    { Name: 'Simon P.', Age: 23, Address: 'Praiestakken 21A' },
  ]
  const expected = [
    ['Age', 'Age'],
    ['Address', 'Address'],
    ['Name', 'Name'],
  ]

  const ret = extractColumns(data, prefix)

  assert.deepEqual(ret, expected)
})
