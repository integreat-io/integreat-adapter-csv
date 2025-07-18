/**
 * Helper function to update array column max length
 */
function updateArrayColumnMaxLength(
  arrayColumnMaxLengths: Map<string, number>,
  key: string,
  arrayLength: number,
): void {
  const currentMax = arrayColumnMaxLengths.get(key) || 0
  arrayColumnMaxLengths.set(key, Math.max(currentMax, arrayLength))
}

/**
 * Helper function to track array column maximum lengths
 */
function trackArrayColumnLengths(
  data: Record<string, unknown>[],
  columnFilter?: (key: string) => boolean,
): Map<string, number> {
  const arrayColumnMaxLengths = new Map<string, number>()

  for (const item of data) {
    for (const [key, value] of Object.entries(item)) {
      if ((!columnFilter || columnFilter(key)) && Array.isArray(value)) {
        updateArrayColumnMaxLength(arrayColumnMaxLengths, key, value.length)
      }
    }
  }

  return arrayColumnMaxLengths
}

/**
 * Helper function to analyze data and extract both columns and array max lengths in one pass
 */
function analyzeDataColumns(data: Record<string, unknown>[]): {
  columns: string[]
  arrayColumnMaxLengths: Map<string, number>
} {
  const encounteredColumns = new Set<string>()
  const arrayColumnMaxLengths = new Map<string, number>()

  for (const item of data) {
    for (const [key, value] of Object.entries(item)) {
      encounteredColumns.add(key)

      if (Array.isArray(value)) {
        updateArrayColumnMaxLength(arrayColumnMaxLengths, key, value.length)
      }
    }
  }

  return {
    columns: Array.from(encounteredColumns),
    arrayColumnMaxLengths,
  }
}

/**
 * Helper function to order columns by prefix
 */
function orderColumnsByPrefix(columns: string[], prefix: string): string[] {
  // Separate columns that match the prefix and have numeric suffix
  const numericPrefixColumns: string[] = []
  const otherColumns: string[] = []

  for (const col of columns) {
    if (col.startsWith(prefix)) {
      const remaining = col.substring(prefix.length)
      if (remaining.match(/^\d+$/)) {
        // It's a valid number after removing prefix (including leading zeros)
        numericPrefixColumns.push(col)
      } else {
        // Starts with prefix but remaining part is not a number
        otherColumns.push(col)
      }
    } else {
      // Doesn't start with prefix
      otherColumns.push(col)
    }
  }

  // Sort numeric prefix columns by the number part
  numericPrefixColumns.sort((a, b) => {
    const aNum = parseInt(a.substring(prefix.length), 10)
    const bNum = parseInt(b.substring(prefix.length), 10)
    return aNum - bNum
  })

  // Combine sorted numeric prefix columns with other columns in original order
  return [...numericPrefixColumns, ...otherColumns]
}

/**
 * Helper function to expand columns with array placeholders
 */
function expandColumnsWithArrays(
  columns: string[],
  arrayColumnMaxLengths: Map<string, number>,
  getDisplayName: (col: string) => string,
): ([string, string] | undefined)[] {
  return columns.flatMap((col) => [
    [col, getDisplayName(col)] as [string, string],
    ...Array(Math.max(0, (arrayColumnMaxLengths.get(col) || 1) - 1)).fill(
      undefined,
    ),
  ])
}

/**
 * Extract the columns present in an array of data items. The columns will be
 * ordered in the order they appear in the data, starting from the first item
 * and adding columns as they are encountered in the data.
 *
 * If a `prefix` is given, we will remove it from the beginning of every column
 * id, and if the resulting part of the id is a number, we will sort ascending
 * by this number.
 *
 * The result will be an array of touples with the column id and the column
 * name, which will be the same as the column id.
 *
 * The columns array will also have room for array values to expand, by leaving
 * open columns with `undefined` instead of a tupple.
 *
 * If a `columnHeaders` object is provided, it will be used as a dictionary for
 * column headers, and the order of the columns will be according to the order
 * in the `columnHeaders` object.
 */
export default function extractColumns(
  data: Record<string, unknown>[],
  prefix?: string,
  columnHeaders?: Record<string, string>,
): ([string, string] | undefined)[] {
  // 1. Get columns and max lengths
  let columns: string[]
  let arrayColumnMaxLengths: Map<string, number>

  if (columnHeaders) {
    columns = Object.keys(columnHeaders)
    arrayColumnMaxLengths = trackArrayColumnLengths(
      data,
      (key) => key in columnHeaders,
    )
  } else {
    const analysis = analyzeDataColumns(data)
    columns = analysis.columns
    arrayColumnMaxLengths = analysis.arrayColumnMaxLengths
  }

  // 2. Order columns if we have a prefix and don't have columnHeaders
  if (!columnHeaders && prefix) {
    columns = orderColumnsByPrefix(columns, prefix)
  }

  // 3. Expand and return columns array
  const getDisplayName = columnHeaders
    ? // eslint-disable-next-line security/detect-object-injection
      (col: string) => columnHeaders[col]
    : (col: string) => col
  return expandColumnsWithArrays(columns, arrayColumnMaxLengths, getDisplayName)
}
