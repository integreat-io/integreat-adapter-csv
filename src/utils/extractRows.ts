/**
 * Extract an array of rows from the given `data`, according to the given
 * `columns`. Each row will be an array of the values from that data object. We
 * will extract these values by using the column ids as keys, in the order they
 * appear in the `columns` array. When a column does not have a matching key on
 * the data object, the value will be `undefined`.
 *
 * `columns` is an array of tupples, where the first value is the column id, and
 * that's the id we will use to match with keys in the data objects.
 *
 * If a value is an array, we will expand the value into the row, and expect the
 * `columns` array to have made room for it (`undefined` in columns).
 */
export default function extractRows(
  data: Record<string, unknown>[],
  columns: ([string, string] | undefined)[],
): unknown[][] {
  return data.map((dataObject) => {
    const result: unknown[] = new Array(columns.length).fill(undefined)

    for (let i = 0; i < columns.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const column = columns[i]
      if (column !== undefined) {
        const [columnId] = column
        // eslint-disable-next-line security/detect-object-injection
        const value = dataObject[columnId]
        if (Array.isArray(value)) {
          // Flatten the entire array starting at current position
          for (let j = 0; j < value.length && i + j < result.length; j++) {
            // eslint-disable-next-line security/detect-object-injection
            result[i + j] = value[j]
          }
        } else {
          // eslint-disable-next-line security/detect-object-injection
          result[i] = value
        }
      }
      // For undefined columns, the position remains undefined (already set by fill)
    }

    return result
  })
}
