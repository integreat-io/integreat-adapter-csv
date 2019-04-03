import test from 'ava'

import serialize from './serialize'

// Setup

const commaString = `"1","Several words here"
"2","And more here"
"3","Even more"
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
      { value: 1, text: 'Several words here' },
      { value: 2, text: 'And more here' },
      { value: 3, text: 'Even more' }
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

test('should return null when no data', async (t) => {
  const request = {
    action: 'SET',
    data: null
  }

  const ret = await serialize(request)

  t.is(ret.data, null)
})
