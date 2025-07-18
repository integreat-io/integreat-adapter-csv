import { stringify } from 'csv-stringify/sync'
import extractColumns from './extractColumns.js'
import extractRows from './extractRows.js'
import { isObject } from './is.js'
import type { Options } from '../types.js'

const createCsvOptions = (
  { delimiter = ',', quoted = true, headerRow = false },
  columns: { key: string; header: string }[],
) => ({
  delimiter,
  quoted,
  header: headerRow,
  columns,
  cast: { boolean: String },
})

function serializeData(data: Record<string, unknown>[], options: Options) {
  const columns = extractColumns(
    data,
    options.columnPrefix ?? 'col',
    options.columnHeaders,
  )
  const rows = extractRows(data, columns)

  const colObjects = columns.map((col, index) =>
    col ? { key: col[0], header: col[1] } : { key: `__${index}`, header: '' },
  )
  return stringify(rows, createCsvOptions(options, colObjects))
}

export default function serialize(data: unknown, options: Options) {
  if (Array.isArray(data)) {
    return serializeData(data, options)
  } else {
    return isObject(data) ? serializeData([data], options) : null
  }
}
