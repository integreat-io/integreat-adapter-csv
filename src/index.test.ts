import test from 'node:test'
import assert from 'node:assert/strict'

import adapter from './index.js'

// Setup

const commaString = `"John F.","45","Fjonveien 18"
"Mary K.","52","Kvølstadbakken 11"
"Simon P.","23","Praiestakken 21A"
`

const csvArray = [
  { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
  { col1: 'Mary K.', col2: '52', col3: 'Kvølstadbakken 11' },
  { col1: 'Simon P.', col2: '23', col3: 'Praiestakken 21A' },
]

const options = {}

// Tests -- prepareOptions

test('should prepare empty options', () => {
  const options = {}
  const expected = {}

  const ret = adapter.prepareOptions(options, 'api')

  assert.deepEqual(ret, expected)
})

test('should remove unknown options', () => {
  const options = { delimiter: ',', quoted: true, removeThis: 'not an option' }
  const expected = { delimiter: ',', quoted: true }

  const ret = adapter.prepareOptions(options, 'api')

  assert.deepEqual(ret, expected)
})

// Tests -- normalize

test('should normalize json string data in response', async () => {
  const action = {
    type: 'GET',
    payload: { type: 'entry' },
    response: { status: 'ok', data: commaString },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'GET',
    payload: { type: 'entry' },
    response: { status: 'ok', data: csvArray },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.normalize(action, options)

  assert.deepEqual(ret, expected)
})

test('should normalize json string data in payload', async () => {
  const action = {
    type: 'GET',
    payload: { type: 'entry', data: commaString },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'GET',
    payload: { type: 'entry', data: csvArray },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.normalize(action, options)

  assert.deepEqual(ret, expected)
})

test('should return error when payload data is not valid csv', async () => {
  const action = {
    type: 'GET',
    payload: { type: 'entry', data: '"invalid","csv"\n"file","' },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'GET',
    payload: { type: 'entry', data: '"invalid","csv"\n"file","' },
    response: {
      status: 'badrequest',
      error: 'Payload data was not valid CSV',
    },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.normalize(action, options)

  assert.deepEqual(ret, expected)
})

test('should return error when response data is not valid csv', async () => {
  const action = {
    type: 'GET',
    payload: { type: 'entry' },
    response: { status: 'ok', data: '"invalid","csv"\n"file","' },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'GET',
    payload: { type: 'entry' },
    response: {
      status: 'badresponse',
      error: 'Response data was not valid CSV',
    },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.normalize(action, options)

  assert.deepEqual(ret, expected)
})

// Tests -- serialize

test('should serialize data in response', async () => {
  const action = {
    type: 'GET',
    payload: { type: 'entry', sourceService: 'api' },
    response: { status: 'ok', data: csvArray },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'GET',
    payload: { type: 'entry', sourceService: 'api' },
    response: { status: 'ok', data: commaString },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.serialize(action, options)

  assert.deepEqual(ret, expected)
})

test('should serialize data in payload', async () => {
  const action = {
    type: 'GET',
    payload: { type: 'entry', sourceService: 'api', data: csvArray },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'GET',
    payload: { type: 'entry', sourceService: 'api', data: commaString },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.serialize(action, options)

  assert.deepEqual(ret, expected)
})
