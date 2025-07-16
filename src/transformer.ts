import normalizeData from './utils/normalize.js'
import serializeData from './utils/serialize.js'
import xor from './utils/xor.js'
import type { Transformer } from 'integreat'

export interface Props {
  columnPrefix?: string
  delimiter?: string
  flip?: boolean
  headerRow?: boolean
  quoted?: boolean
}

const createOptions = ({
  columnPrefix,
  delimiter,
  headerRow,
  quoted,
}: Props) => ({
  columnPrefix,
  delimiter,
  headerRow,
  quoted,
})

const csv: Transformer = (props: Props) => () =>
  function (data, state) {
    const options = createOptions(props)
    const rev = xor(state.rev, xor(state.flip, props.flip))

    try {
      return rev
        ? (serializeData(data, options) ?? undefined)
        : (normalizeData(data, options) ?? undefined)
    } catch {
      return undefined
    }
  }

export default csv
