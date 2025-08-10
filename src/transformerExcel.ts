import normalizeData from './utils/normalize.js'
import serializeExcelData from './utils/serializeExcel.js'
import xor from './utils/xor.js'
import type { AsyncTransformer } from 'integreat'

export interface Props {
  columnPrefix?: string
  delimiter?: string
  flip?: boolean
  headerRow?: boolean
  quoted?: boolean
  columnHeaders?: Record<string, string>
}

const createOptions = ({
  columnPrefix,
  delimiter,
  headerRow,
  quoted,
  columnHeaders,
}: Props) => ({
  columnPrefix,
  delimiter,
  headerRow,
  quoted,
  columnHeaders,
})

const csv: AsyncTransformer = (props: Props) => () =>
  async function (data, state) {
    const options = createOptions(props)
    const rev = xor(state.rev, props.flip)

    try {
      return rev
        ? ((await serializeExcelData(data, options)) ?? undefined)
        : (normalizeData(data, options) ?? undefined) // TODO: Implement Excel normalization
    } catch {
      return undefined
    }
  }

export default csv
