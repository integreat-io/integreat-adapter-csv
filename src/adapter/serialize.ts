/// <reference path="../../integreat.d.ts" />
import { Request } from 'integreat'
import { EndpointOptions } from '.'
import stringify = require('csv-stringify/lib/sync')

const createOptions = ({ delimiter = ',', quoted = true, headerRow = false }, columns: Record<string, string>) => ({
  delimiter,
  quoted,
  header: headerRow,
  columns,
  cast: { boolean: String }
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

const expandValueArray = (key: string, value: unknown) => Array.isArray(value)
  ? value.reduce((obj, val, index) => ({ ...obj, [`${key}-${index + 1}`]: val }), {})
  : { [key]: value }

const reorderFields = <T = unknown>(item: Record<string, T>): Record<string, T> => Object.entries(item)
  .sort(sortFields)
  .reduce((object, [key, value]) => ({ ...object, ...expandValueArray(key, value) }), {})

const extractColumns = (rows: Record<string, unknown>[]): Record<string, string> =>
  reorderFields(rows.reduce<Record<string, string>>(
    (fields, row) => Object.keys(row).reduce((fields, field) => ({ ...fields, [field]: field }), fields),
  {}))


function serializeData (data: Record<string, unknown>[], options: EndpointOptions) {
  const rows = data.map(reorderFields)
  const columns = extractColumns(rows)
  return stringify(rows, createOptions(options, columns))
}
export default async function serialize (request: Request<Record<string, unknown>[] | null>) {
  return {
    ...request,
    data: (request.data) ? serializeData(request.data, request.endpoint || {}) : null
  }
}
