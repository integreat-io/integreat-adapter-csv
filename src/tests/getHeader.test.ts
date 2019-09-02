import test from 'ava'
import mockFs = require('mock-fs')

import resources from '..'
const { csv: adapter } = resources.adapters

// Setup

const csvTxt = `"Name";"Age";"Street address"
"John F.";"45" ;"Fjonveien 18"
"Mary K.";"52";"Kvølstadbakken 11"
"Simon P.";"23"; "Praiestakken 21A"
`

test.before(() => {
  mockFs({
    'files/stored/here': {
      'csv.txt': csvTxt
    }
  })
})

test.after.always(() => {
  mockFs.restore()
})

// Tests

test('should get data', async (t) => {
  const request = {
    action: 'GET',
    endpoint: {
      fileName: `files/stored/here/csv.txt`,
      delimiter: ';',
      headerRow: true
    },
    data: null
  }
  const expectedData = [
    { Name: 'John F.', Age: '45', 'Street-address': 'Fjonveien 18' },
    { Name: 'Mary K.', Age: '52', 'Street-address': 'Kvølstadbakken 11' },
    { Name: 'Simon P.', Age: '23', 'Street-address': 'Praiestakken 21A' }
  ]

  const response = await adapter.send(request)
  const ret = await adapter.normalize(response, request)

  t.is(ret.status, 'ok')
  t.deepEqual(ret.data, expectedData)
})
