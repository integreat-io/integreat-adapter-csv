/// <reference path="../../integreat.d.ts" />
import { Response, Request } from 'integreat'
import { EndpointOptions } from '.'
import parse = require('csv-parse/lib/sync')

const createOptions = ({ delimiter = ',' }) => ({
  skip_empty_lines: true,
  trim: true,
  delimiter
})

const normalizeColumns = (cols: string[]) =>
  cols.map(col => col.replace(/[\s\.]+/g, '-'))

const createColumnKey = (index: number, headers: string[], prefix: string) =>
  headers[index] || `${prefix}${ index + 1 }`

const normalizeLine = (columnPrefix = 'col', headers: string[] = []) =>
  (fields: string[]) => fields.reduce(
    (item, value, index) => ({
      ...item,
      [createColumnKey(index, headers, columnPrefix)]: value
    }), {}
  )

const readRows = (data: string, options: EndpointOptions) =>
  parse(data, createOptions(options)) as string[][]

const normalizeRows = (rows: string[][], { headerRow = false, columnPrefix }: EndpointOptions) => {
  if (headerRow) {
    const headers = normalizeColumns(rows[0])
    return rows.slice(1).map(normalizeLine(columnPrefix, headers))
  }

  return rows.map(normalizeLine(columnPrefix))
}

export default async function normalize (response: Response<string | null>, request: Request<string | null>) {
  if (!response.data) {
    return { ...response, data: null }
  }
  const options = request.endpoint || {}
  try {
    const rows = readRows(response.data, options)
    return { ...response, data: normalizeRows(rows, options) }
  } catch (error) {
    throw new Error('Invalid csv format')
  }
}
