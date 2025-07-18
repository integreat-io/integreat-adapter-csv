import test from 'node:test'
import assert from 'node:assert/strict'

import serialize from './serialize.js'

// Setup

const commaString = `"1","Several words here","39"
"2","And more here","45"
"3","Even more","81"
`

const semicolonString = `1;Several words here
2;And more here
3;Even more
`

const options = {}

// Tests

test('should serialize array of simple data objects', () => {
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    { value: 2, text: 'And more here', age: 45 },
    { value: 3, text: 'Even more', age: 81 },
  ]
  const expectedData = commaString

  const ret = serialize(data, options)

  assert.equal(ret, expectedData)
})

test('should serialize simple data object', () => {
  const data = { value: 1, text: 'Several words here', age: 39 }
  const expectedData = '"1","Several words here","39"\n'

  const ret = serialize(data, options)

  assert.equal(ret, expectedData)
})

test('should order col-fields and put them before other fields', () => {
  const data = [
    { col2: 'Several words here', age: 39, col1: 1 },
    { age: 45, col2: 'And more here', col1: 2 },
    { col3: true, col2: 'Even more', age: 81, col1: 3 },
  ]
  const expectedData = `"1","Several words here",,"39"
"2","And more here",,"45"
"3","Even more","true","81"
`

  const ret = serialize(data, options)

  assert.equal(ret, expectedData)
})

test('should expand arrays in place', () => {
  const data = [
    { age: 39, col1: [1, 'Several words here', 'And here'] },
    { age: 45, col1: [2, 'And more here'] },
    { age: 81, col1: [3, 'Even more'] },
  ]
  const expectedData = `"1","Several words here","And here","39"
"2","And more here",,"45"
"3","Even more",,"81"
`

  const ret = serialize(data, options)

  assert.equal(ret, expectedData)
})

test('should serialize simple data object with semicolons', () => {
  const options = { quoted: false, delimiter: ';' }
  const data = [
    { value: 1, text: 'Several words here' },
    { value: 2, text: 'And more here' },
    { value: 3, text: 'Even more' },
  ]
  const expectedData = semicolonString

  const ret = serialize(data, options)

  assert.equal(ret, expectedData)
})

test('should include header row', () => {
  const options = { headerRow: true }
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    { value: 2, text: 'And more here', age: 45 },
    { value: 3, text: 'Even more', age: 81 },
  ]
  const expectedData = '"value","text","age"\n' + commaString

  const ret = serialize(data, options)

  assert.equal(ret, expectedData)
})

test('should include header row with a provided columnHeaders options', () => {
  const columnHeaders = {
    value: '#',
    text: 'The text',
    age: 'Age',
  }
  const options = { headerRow: true, columnHeaders }
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    { value: 2, text: 'And more here', age: 45 },
    { value: 3, text: 'Even more', age: 81 },
  ]
  const expectedData = '"#","The text","Age"\n' + commaString

  const ret = serialize(data, options)

  assert.equal(ret, expectedData)
})

test('should include header row with a provided columnHeaders options and data items in different order', () => {
  const columnHeaders = {
    value: '#',
    text: 'The text',
    age: 'Age',
  }
  const options = { headerRow: true, columnHeaders }
  const data = [
    { text: 'Several words here', age: 39, value: 1 },
    { value: 2, age: 45, text: 'And more here' },
    { age: 81, text: 'Even more', value: 3 },
  ]
  const expectedData = '"#","The text","Age"\n' + commaString

  const ret = serialize(data, options)

  assert.equal(ret, expectedData)
})

test('should serialize data objects with different number of fields', () => {
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    {
      value: 2,
      text: 'And more here',
      age: 45,
      phone: '911 88 123',
      vip: true,
    },
    { value: 3, text: 'Even more', phone: '904 13 411', age: 81 },
  ]
  const expectedData = `"1","Several words here","39",,
"2","And more here","45","911 88 123","true"
"3","Even more","81","904 13 411",
`

  const ret = serialize(data, options)

  assert.equal(ret, expectedData)
})

test('should return null when no data', () => {
  const data = null

  const ret = serialize(data, options)

  assert.equal(ret, null)
})
