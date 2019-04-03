import test from 'ava'
import sinon = require('sinon')

import send from './send'

// Tests

test('should read file', async (t) => {
  const fileContent = '"file","content"'
  const fs = {
    readFile: sinon.stub().callsArgWith(1, null, fileContent)
  }
  const request = {
    action: 'GET',
    data: null,
    endpoint: { fileName: '/files/csv.txt' }
  }
  const expected = {
    status: 'ok',
    data: fileContent
  }

  const ret = await send(fs as any)(request)

  t.deepEqual(ret, expected)
  t.is(fs.readFile.callCount, 1)
  t.is(fs.readFile.args[0][0], '/files/csv.txt')
})

test('should throw when no file name', async (t) => {
  const fs = {
    readFile: sinon.stub().callsArgWith(1, null, '')
  }
  const request = {
    action: 'GET',
    data: null
  }

  const error = await t.throwsAsync(send(fs as any)(request))

  t.is(error.message, 'A file name is required')
})
