import generateExcel from './generateExcel.js'
import extractColumns from './extractColumns.js'
import extractRows from './extractRows.js'
import { isObject } from './is.js'
import type { Options } from '../types.js'

async function serializeData(
  data: Record<string, unknown>[],
  { columnPrefix, headerRow, columnHeaders }: Options,
) {
  const columns = extractColumns(data, columnPrefix ?? 'col', columnHeaders)
  const rows = extractRows(data, columns)
  const headers = headerRow
    ? columns.map((col) => (Array.isArray(col) ? col[1] : undefined))
    : undefined

  return await generateExcel(rows, headers)
}

export default async function serialize(data: unknown, options: Options) {
  if (Array.isArray(data)) {
    return serializeData(data, options)
  } else {
    return isObject(data) ? serializeData([data], options) : null
  }
}
