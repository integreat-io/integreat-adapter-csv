/// <reference path="../../integreat.d.ts" />
import { Request } from 'integreat'
import { EndpointOptions } from '.'
import stringify = require('csv-stringify/lib/sync')

type Value = string | number | (string | number)[]

interface Data {
  [key: string]: Value
}

const createOptions = ({ delimiter = ',', quoted = true, headerRow = false }) => ({
  delimiter,
  quoted,
  header: headerRow
})

const extractColNo = (key: string) => typeof key === 'string' && key.startsWith('col')
  ? Number.parseInt(key.substr(3)) : undefined

const isNumber = (num: unknown): num is number => typeof num === 'number' && !Number.isNaN(num)

const sortFields = ([keyA]: [string, unknown], [keyB]: [string, unknown]) => {
  const noA = extractColNo(keyA)
  const noB = extractColNo(keyB)
  return isNumber(noA) && isNumber(noB)
    ? noA - noB : Number(isNumber(noB)) - Number(isNumber(noA))
}

const expandValueArray = (key: string, value: Value) => Array.isArray(value)
  ? value.reduce((obj, val, index) => ({ ...obj, [`${key}-${index + 1}`]: val }), {})
  : { [key]: value }

const reorderFields = (item: Data) => Object.entries(item)
  .sort(sortFields)
  .reduce((object, [key, value]) => ({ ...object, ...expandValueArray(key, value) }), {} as Data)

const serializeData = (data: Data[], options: EndpointOptions) =>
  stringify(data.map(reorderFields), createOptions(options))

export default async function serialize (request: Request<Data[] | null>) {
  return {
    ...request,
    data: (request.data) ? serializeData(request.data, request.endpoint || {}) : null
  }
}
