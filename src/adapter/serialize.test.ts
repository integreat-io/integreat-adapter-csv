import test from 'ava'

import serialize from './serialize'

// Setup

const commaString = `"1","Several words here","39"
"2","And more here","45"
"3","Even more","81"
`

const semicolonString = `1;Several words here
2;And more here
3;Even more
`

// Tests

test('should serialize simple data object', async (t) => {
  const request = {
    action: 'SET',
    data: [
      { value: 1, text: 'Several words here', age: 39 },
      { value: 2, text: 'And more here', age: 45 },
      { value: 3, text: 'Even more', age: 81 }
    ]
  }
  const expectedData = commaString

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should order col-fields and put them before other fields', async (t) => {
  const request = {
    action: 'SET',
    data: [
      { col2: 'Several words here', age: 39, col1: 1 },
      { age: 45, col2: 'And more here', col1: 2 },
      { col3: true, col2: 'Even more', age: 81, col1: 3 }
    ]
  }
  const expectedData = `"1","Several words here",,"39"
"2","And more here",,"45"
"3","Even more","true","81"
`

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should expand arrays in place', async (t) => {
  const request = {
    action: 'SET',
    data: [
      { age: 39, col1: [1, 'Several words here'] },
      { age: 45, col1: [2, 'And more here'] },
      { age: 81, col1: [3, 'Even more'] }
    ]
  }
  const expectedData = commaString

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should serialize simple data object with semicolons', async (t) => {
  const request = {
    action: 'SET',
    data: [
      { value: 1, text: 'Several words here' },
      { value: 2, text: 'And more here' },
      { value: 3, text: 'Even more' }
    ],
    endpoint: { quoted: false, delimiter: ';' }
  }
  const expectedData = semicolonString

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should include header row', async (t) => {
  const request = {
    action: 'SET',
    data: [
      { value: 1, text: 'Several words here', age: 39 },
      { value: 2, text: 'And more here', age: 45 },
      { value: 3, text: 'Even more', age: 81 }
    ],
    endpoint: { headerRow: true }
  }
  const expectedData = '"value","text","age"\n' + commaString

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should serialize data objects with different number of fields', async (t) => {
  const request = {
    action: 'SET',
    data: [
      { value: 1, text: 'Several words here', age: 39 },
      { value: 2, text: 'And more here', age: 45, phone: '911 88 123', vip: true },
      { value: 3, text: 'Even more', phone: '904 13 411', age: 81 }
    ]
  }
  const expectedData = `"1","Several words here","39",,
"2","And more here","45","911 88 123","true"
"3","Even more","81","904 13 411",
`

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should return null when no data', async (t) => {
  const request = {
    action: 'SET',
    data: null
  }

  const ret = await serialize(request)

  t.is(ret.data, null)
})
