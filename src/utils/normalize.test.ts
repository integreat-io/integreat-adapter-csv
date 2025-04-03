import test from 'node:test'
import assert from 'node:assert/strict'

import normalize from './normalize.js'

// Setup

const commaString = `"John F.","45","Fjonveien 18"
"Mary K.","52","Kvølstadbakken 11"
"Simon P.","23","Praiestakken 21A"`

const semicolonString = `John F.;45;Fjonveien 18
Mary K.;52;Kvølstadbakken 11
Simon P.;23; Praiestakken 21A`

const headerString = `"Name","Age","Street addr."
"John F.","45","Fjonveien 18"
"Mary K.","52","Kvølstadbakken 11"
"Simon P.","23","Praiestakken 21A"`

// Tests

test('should normalize simple csv data', () => {
  const options = {}
  const data = commaString
  const expected = [
    { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: '52', col3: 'Kvølstadbakken 11' },
    { col1: 'Simon P.', col2: '23', col3: 'Praiestakken 21A' },
  ]

  const ret = normalize(data, options)

  assert.deepEqual(ret, expected)
})

test('should normalize semicolon csv data', () => {
  const options = { delimiter: ';' }
  const data = semicolonString
  const expected = [
    { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: '52', col3: 'Kvølstadbakken 11' },
    { col1: 'Simon P.', col2: '23', col3: 'Praiestakken 21A' },
  ]

  const ret = normalize(data, options)

  assert.deepEqual(ret, expected)
})

test('should normalize semicolon csv data with customized column prefix', () => {
  const options = { columnPrefix: 'field_' }
  const data = commaString
  const expected = [
    { field_1: 'John F.', field_2: '45', field_3: 'Fjonveien 18' },
    { field_1: 'Mary K.', field_2: '52', field_3: 'Kvølstadbakken 11' },
    { field_1: 'Simon P.', field_2: '23', field_3: 'Praiestakken 21A' },
  ]

  const ret = normalize(data, options)

  assert.deepEqual(ret, expected)
})

test('should normalize semicolon csv data with header row', () => {
  const options = { headerRow: true }
  const data = headerString
  const expected = [
    { Name: 'John F.', Age: '45', 'Street-addr-': 'Fjonveien 18' },
    { Name: 'Mary K.', Age: '52', 'Street-addr-': 'Kvølstadbakken 11' },
    { Name: 'Simon P.', Age: '23', 'Street-addr-': 'Praiestakken 21A' },
  ]

  const ret = normalize(data, options)

  assert.deepEqual(ret, expected)
})

test('should normalize csv data with rows of different number of columns', () => {
  const options = {}
  const data = `"John F.","45","Fjonveien 18"
    "Mary K.","52","Kvølstadbakken 11","911 88 123","true"
    "Simon P.","23","Praiestakken 21A","904 13 411"`
  const expected = [
    { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
    {
      col1: 'Mary K.',
      col2: '52',
      col3: 'Kvølstadbakken 11',
      col4: '911 88 123',
      col5: 'true',
    },
    {
      col1: 'Simon P.',
      col2: '23',
      col3: 'Praiestakken 21A',
      col4: '904 13 411',
    },
  ]

  const ret = normalize(data, options)

  assert.deepEqual(ret, expected)
})

test('should respond with null data when not a string', () => {
  const options = {}
  const data = null

  const ret = normalize(data, options)

  assert.equal(ret, null)
})

test('should throw when csv is invalid', () => {
  const options = {}
  const data = '"invalid","csv"\n"file","'
  const exptected = { message: 'Data was not valid CSV' }

  assert.throws(() => normalize(data, options), exptected)
})
