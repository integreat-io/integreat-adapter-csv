import test from 'ava'

import normalize from './normalize'

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

test('should normalize simple csv data', async (t) => {
  const request = {
    action: 'GET',
    data: null
  }
  const response = {
    status: 'ok',
    data: commaString

  }
  const expected = [
    { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: '52', col3: 'Kvølstadbakken 11' },
    { col1: 'Simon P.', col2: '23', col3: 'Praiestakken 21A' }
  ]

  const ret = await normalize(response, request)

  t.deepEqual(ret.data, expected)
})

test('should normalize semicolon csv data', async (t) => {
  const request = {
    action: 'GET',
    data: null,
    endpoint: { delimiter: ';' }
  }
  const response = {
    status: 'ok',
    data: semicolonString

  }
  const expected = [
    { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: '52', col3: 'Kvølstadbakken 11' },
    { col1: 'Simon P.', col2: '23', col3: 'Praiestakken 21A' }
  ]

  const ret = await normalize(response, request)

  t.deepEqual(ret.data, expected)
})

test('should normalize semicolon csv data with customized column prefix', async (t) => {
  const request = {
    action: 'GET',
    data: null,
    endpoint: { columnPrefix: 'field_' }
  }
  const response = {
    status: 'ok',
    data: commaString

  }
  const expected = [
    { field_1: 'John F.', field_2: '45', field_3: 'Fjonveien 18' },
    { field_1: 'Mary K.', field_2: '52', field_3: 'Kvølstadbakken 11' },
    { field_1: 'Simon P.', field_2: '23', field_3: 'Praiestakken 21A' }
  ]

  const ret = await normalize(response, request)

  t.deepEqual(ret.data, expected)
})

test('should normalize semicolon csv data with header row', async (t) => {
  const request = {
    action: 'GET',
    data: null,
    endpoint: { headerRow: true }
  }
  const response = {
    status: 'ok',
    data: headerString

  }
  const expected = [
    { Name: 'John F.', Age: '45', 'Street-addr-': 'Fjonveien 18' },
    { Name: 'Mary K.', Age: '52', 'Street-addr-': 'Kvølstadbakken 11' },
    { Name: 'Simon P.', Age: '23', 'Street-addr-': 'Praiestakken 21A' }
  ]

  const ret = await normalize(response, request)

  t.deepEqual(ret.data, expected)
})

test('should respond with null data when not a string', async (t) => {
  const request = {
    action: 'GET',
    data: null
  }
  const response = {
    status: 'ok',
    data: null

  }

  const ret = await normalize(response, request)

  t.is(ret.data, null)
})

test('should throw when csv is invalid', async (t) => {
  const request = {
    action: 'GET',
    data: null
  }
  const response = {
    status: 'ok',
    data: 'invalid,csv\nfile'

  }

  const error = await t.throwsAsync(normalize(response, request))

  t.is(error.message, 'Invalid csv format')
})
