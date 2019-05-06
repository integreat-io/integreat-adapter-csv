import test from 'ava'
import sinon = require('sinon')

import send from './send'

// Setup

const fsMock = {
  readFile: (_path: string, cb: (err: object | null, data: string) => void) => { cb(null, '') },
  writeFile: (_file: string, _data: string, _options: string, cb: (err: object | null) => void) => { cb(null) }
}

// Tests

test('should read file', async (t) => {
  const fileContent = '"file","content"'
  const fs = {
    ...fsMock,
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

test('should write file', async (t) => {
  const fileContent = '"file","content"'
  const fs = {
    ...fsMock,
    writeFile: sinon.stub().callsArgWith(3, null)
  }
  const request = {
    action: 'SET',
    data: fileContent,
    endpoint: { fileName: '/files/csv.txt' }
  }
  const expected = {
    status: 'ok',
    data: fileContent
  }

  const ret = await send(fs as any)(request)

  t.deepEqual(ret, expected)
  t.is(fs.writeFile.callCount, 1)
  t.is(fs.writeFile.args[0][0], '/files/csv.txt')
  t.is(fs.writeFile.args[0][1], fileContent)
  t.is(fs.writeFile.args[0][2], 'utf8')
})

test('should throw when no file name', async (t) => {
  const fs = {
    ...fsMock,
    readFile: sinon.stub().callsArgWith(1, null, '')
  }
  const request = {
    action: 'GET',
    data: null
  }

  const error = await t.throwsAsync(send(fs as any)(request))

  t.is(error.message, 'A file name is required')
})

test('should throw when attempting to write non-string', async (t) => {
  const fileContent = null
  const fs = {
    ...fsMock,
    writeFile: sinon.stub().callsArgWith(3, null)
  }
  const request = {
    action: 'SET',
    data: fileContent,
    endpoint: { fileName: '/files/csv.txt' }
  }

  const error = await t.throwsAsync(send(fs as any)(request))

  t.is(error.message, 'CSV adapter can only write string to file')
})
