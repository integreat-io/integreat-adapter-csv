import test from 'node:test'
import assert from 'node:assert/strict'

import serializeExcel from './serializeExcel.js'

// Setup

const options = {}

// Tests

test('should serialize array of simple data objects', async () => {
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    { value: 2, text: 'And more here', age: 45 },
    { value: 3, text: 'Even more', age: 81 },
  ]

  const ret = await serializeExcel(data, options)

  assert.equal(typeof ret, 'string')
  assert.equal((ret as string).slice(0, 13), 'UEsDBAoAAAAAA') // This indicates that we have gotten a base64 encoded Excel
})
