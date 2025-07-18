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
 */
export default function extractColumns(
  data: Record<string, unknown>[],
  prefix?: string,
): ([string, string] | undefined)[] {
  // Set to keep track of encountered columns in order
  const encounteredColumns = new Set<string>()
  // Track array columns and their maximum lengths
  const arrayColumnMaxLengths = new Map<string, number>()

  // Iterate through all objects to collect columns in order and track array lengths
  for (const item of data) {
    for (const [key, value] of Object.entries(item)) {
      encounteredColumns.add(key)

      if (Array.isArray(value)) {
        const currentMax = arrayColumnMaxLengths.get(key) || 0
        arrayColumnMaxLengths.set(key, Math.max(currentMax, value.length))
      }
    }
  }

  const columns = Array.from(encounteredColumns)

  // If no prefix is provided, return columns in encountered order
  if (!prefix) {
    return columns.flatMap((col) => [
      [col, col] as [string, string],
      ...Array(Math.max(0, (arrayColumnMaxLengths.get(col) || 1) - 1)).fill(
        undefined,
      ),
    ])
  }

  // If prefix is provided, separate columns that match the prefix and have numeric suffix
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
  const result = [...numericPrefixColumns, ...otherColumns]

  return result.flatMap((col) => [
    [col, col] as [string, string],
    ...Array(Math.max(0, (arrayColumnMaxLengths.get(col) || 1) - 1)).fill(
      undefined,
    ),
  ])
}
