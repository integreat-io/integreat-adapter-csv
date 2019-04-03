import test from 'ava'

import resources from '..'
const { csv: adapter } = resources.adapters

// Tests

test('should get data', async (t) => {
  const request = {
    action: 'GET',
    endpoint: {
      fileName: `${__dirname}/../../files/csv.txt`,
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
