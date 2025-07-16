import test from 'node:test'
import assert from 'node:assert/strict'

import csv from './transformer.js'

// Setup

const props = {}
const options = {}
const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}
const stateRev = {
  rev: true,
  onlyMappedValues: false,
  context: [],
  value: {},
}

const commaString = `"John F.","45","Fjonveien 18"
"Mary K.","52","Kvølstadbakken 11"
"Simon P.","23","Praiestakken 21A"
`

const semicolonStringWithHeader = `Name;Age;Streetaddress
John F.;45;Fjonveien 18
Mary K.;52;Kvølstadbakken 11
Simon P.;23;Praiestakken 21A
`

const csvArray = [
  { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
  { col1: 'Mary K.', col2: '52', col3: 'Kvølstadbakken 11' },
  { col1: 'Simon P.', col2: '23', col3: 'Praiestakken 21A' },
]

const csvArrayWithHeader = [
  { Name: 'John F.', Age: '45', Streetaddress: 'Fjonveien 18' },
  { Name: 'Mary K.', Age: '52', Streetaddress: 'Kvølstadbakken 11' },
  { Name: 'Simon P.', Age: '23', Streetaddress: 'Praiestakken 21A' },
]

// Tests -- from service

test('should parse csv from service', () => {
  const data = commaString
  const expected = csvArray

  const ret = csv(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should honor props when parsing csv from service', () => {
  const props = { delimiter: ';', quoted: false, headerRow: true }
  const data = semicolonStringWithHeader
  const expected = csvArrayWithHeader

  const ret = csv(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should support columnPrefix when parsing csv from service', () => {
  const props = { columnPrefix: 'field_' }
  const data = commaString
  const expected = [
    { field_1: 'John F.', field_2: '45', field_3: 'Fjonveien 18' },
    { field_1: 'Mary K.', field_2: '52', field_3: 'Kvølstadbakken 11' },
    { field_1: 'Simon P.', field_2: '23', field_3: 'Praiestakken 21A' },
  ]

  const ret = csv(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should return undefined when invalid csv from service', () => {
  const data = '"invalid","csv"\n"file","'
  const expected = undefined

  const ret = csv(props)(options)(data, state)

  assert.equal(ret, expected)
})

test('should return undefined when no string from service', () => {
  const data = new Date()
  const expected = undefined

  const ret = csv(props)(options)(data, state)

  assert.equal(ret, expected)
})

// Tests -- to service

test('should stringify csv to service', () => {
  const data = csvArray
  const expected = commaString

  const ret = csv(props)(options)(data, stateRev)

  assert.equal(ret, expected)
})

test('should honor props when stringifying csv to service', () => {
  const props = { delimiter: ';', quoted: false, headerRow: true }
  const data = csvArrayWithHeader
  const expected = semicolonStringWithHeader

  const ret = csv(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should support columnPrefix when stringifying csv to service', () => {
  const props = { columnPrefix: 'field_' }
  const data = [
    { field_1: 'John F.', field_2: '45', field_3: 'Fjonveien 18' },
    { field_1: 'Mary K.', field_2: '52', field_3: 'Kvølstadbakken 11' },
    { field_1: 'Simon P.', field_2: '23', field_3: 'Praiestakken 21A' },
  ]
  const expected = commaString

  const ret = csv(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should return undefined when invalid csv to service', () => {
  const data = new Date()
  const expected = undefined

  const ret = csv(props)(options)(data, stateRev)

  assert.equal(ret, expected)
})
