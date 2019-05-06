import test from 'ava'
import mockFs = require('mock-fs')

import resources from '..'
const { csv: adapter } = resources.adapters

// Setup

const csvTxt = `"John F.";"45" ;"Fjonveien 18"
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
      delimiter: ';'
    },
    data: null
  }
  const expectedData = [
    { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
    { col1: 'Mary K.', col2: '52', col3: 'Kvølstadbakken 11' },
    { col1: 'Simon P.', col2: '23', col3: 'Praiestakken 21A' }
  ]

  const response = await adapter.send(request)
  const ret = await adapter.normalize(response, request)

  t.is(ret.status, 'ok')
  t.deepEqual(ret.data, expectedData)
})
