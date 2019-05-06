import test from 'ava'
import mockFs = require('mock-fs')

import resources from '..'
const { csv: adapter } = resources.adapters

// Setup

interface File {
  _content: string | Buffer
}

interface Folder {
  [key: string]: {
    _items: Folder | File
  }
}

const csvFile = `"John F.";"45";"Fjonveien 18"
"Mary K.";"52";"Kvølstadbakken 11"
"Simon P.";"23";"Praiestakken 21A"
`

const getFsMockDir = (path: string) => path.split('/').filter(Boolean)
  .reduce(
    (current: Folder, dirname: string) => current && current[dirname] && current[dirname]._items as Folder,
    (mockFs as any).getMockRoot()._items
  )

const getFsFileString = (dir: Folder, filename: string) => dir[filename] && (dir[filename] as any)._content && (dir[filename] as any)._content.toString()

// Tests

test('should set data', async (t) => {
  mockFs({ 'write/files': {} })
  const request = {
    action: 'SET',
    endpoint: {
      fileName: `write/files/csv.txt`,
      delimiter: ';'
    },
    data: [
      { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
      { col1: 'Mary K.', col2: '52', col3: 'Kvølstadbakken 11' },
      { col1: 'Simon P.', col2: '23', col3: 'Praiestakken 21A' }
    ]
  }
  const expectedFile = csvFile

  const serialized = await adapter.serialize(request)
  const ret = await adapter.send(serialized)
  // const ret = await adapter.normalize(response, serialized)

  t.is(ret.status, 'ok')
  const dir = getFsMockDir(`${process.cwd()}/write/files`)
  const file = getFsFileString(dir, 'csv.txt')
  t.is(file, expectedFile)

  mockFs.restore()
})
