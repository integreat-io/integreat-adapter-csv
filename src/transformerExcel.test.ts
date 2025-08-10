import test from 'node:test'
import assert from 'node:assert/strict'

import excel from './transformerExcel.js'

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

const csvArray = [
  { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
  { col1: 'Mary K.', col2: '52', col3: 'Kvølstadbakken 11' },
  { col1: 'Simon P.', col2: '23', col3: 'Praiestakken 21A' },
]

// TODO: Implement _from_ service

// Tests -- to service

test('should stringify Excel to service', async () => {
  const data = csvArray

  const ret = await excel(props)(options)(data, stateRev)

  assert.equal(typeof ret, 'string')
  assert.equal((ret as string).slice(0, 13), 'UEsDBAoAAAAAA') // This indicates that we have gotten a base64 encoded Excel
})

// Note: This doesn't really test that there are columns in the Excel sheet, it
// only makes sure that we still return Excel. The test should be improved so
// that we extract the actual header row from the Excel and verify it.
test('should stringify Excel with columns', async () => {
  const props = { headerRow: true }
  const data = csvArray

  const ret = await excel(props)(options)(data, stateRev)

  assert.equal(typeof ret, 'string')
  assert.equal((ret as string).slice(0, 13), 'UEsDBAoAAAAAA') // This indicates that we have gotten a base64 encoded Excel
})

test('should stringify Excel to service even in flipped state', async () => {
  const stateRevFlipped = { ...stateRev, flip: true }
  const data = csvArray

  const ret = await excel(props)(options)(data, stateRevFlipped)

  assert.equal(typeof ret, 'string')
  assert.equal((ret as string).slice(0, 13), 'UEsDBAoAAAAAA') // This indicates that we have gotten a base64 encoded Excel
})

test('should stringify Excel to service going forward with flip prop', async () => {
  const props = { flip: true }
  const data = csvArray

  const ret = await excel(props)(options)(data, state)

  assert.equal(typeof ret, 'string')
  assert.equal((ret as string).slice(0, 13), 'UEsDBAoAAAAAA') // This indicates that we have gotten a base64 encoded Excel
})

test('should return undefined when invalid csv to service', async () => {
  const data = new Date()
  const expected = undefined

  const ret = await excel(props)(options)(data, stateRev)

  assert.equal(ret, expected)
})
