/// <reference path="../../integreat.d.ts" />
import { Request } from 'integreat'
import { EndpointOptions } from '.'
import stringify = require('csv-stringify/lib/sync')

interface Data {
  [key: string]: string | number
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

const reorderFields = (item: Data) => Object.entries(item)
  .sort(sortFields)
  .reduce((object, [key, value]) => ({ ...object, [key]: value }), {} as Data)

const serializeData = (data: Data[], options: EndpointOptions) =>
  stringify(data.map(reorderFields), createOptions(options))

export default async function serialize (request: Request<Data[] | null>) {
  return {
    ...request,
    data: (request.data) ? serializeData(request.data, request.endpoint || {}) : null
  }
}
