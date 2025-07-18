import generateExcel from './generateExcel.js'
import extractColumns from './extractColumns.js'
import extractRows from './extractRows.js'
import { isObject } from './is.js'
import type { Options } from '../types.js'

async function serializeData(
  data: Record<string, unknown>[],
  options: Options,
) {
  const columns = extractColumns(data, options.columnPrefix ?? 'col')
  const rows = extractRows(data, columns)

  return await generateExcel(rows)
}

export default async function serialize(data: unknown, options: Options) {
  if (Array.isArray(data)) {
    return serializeData(data, options)
  } else {
    return isObject(data) ? serializeData([data], options) : null
  }
}
