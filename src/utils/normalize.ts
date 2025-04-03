import { parse } from 'csv-parse/sync'
import type { Options } from '../types.js'

const createCsvOptions = ({ delimiter = ',' }) => ({
  skip_empty_lines: true,
  trim: true,
  relax_column_count: true,
  delimiter,
})

const normalizeColumns = (cols: string[]) =>
  cols.map((col) => col.replace(/[\s.]+/g, '-'))

const createColumnKey = (index: number, headers: string[], prefix: string) =>
  headers[index] || `${prefix}${index + 1}` // eslint-disable-line security/detect-object-injection

const normalizeLine =
  (columnPrefix = 'col', headers: string[] = []) =>
  (fields: string[]) =>
    fields.reduce(
      (item, value, index) => ({
        ...item,
        [createColumnKey(index, headers, columnPrefix)]: value,
      }),
      {},
    )

const readRows = (data: string, options: Options) =>
  parse(data, createCsvOptions(options)) as string[][]

const normalizeRows = (
  rows: string[][],
  { headerRow = false, columnPrefix }: Options,
) => {
  if (headerRow) {
    const headers = normalizeColumns(rows[0])
    return rows.slice(1).map(normalizeLine(columnPrefix, headers))
  }

  return rows.map(normalizeLine(columnPrefix))
}

export default function normalize(data: unknown, options: Options) {
  if (typeof data !== 'string') {
    return null
  }

  try {
    const rows = readRows(data, options)
    return normalizeRows(rows, options)
  } catch {
    throw new Error('Data was not valid CSV')
  }
}
