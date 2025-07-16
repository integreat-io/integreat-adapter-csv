import normalizeData from './utils/normalize.js'
import serializeData from './utils/serialize.js'
import type { Transformer } from 'integreat'

export interface Props {
  delimiter?: string
  quoted?: boolean
  headerRow?: boolean
}

const createOptions = ({ delimiter, quoted, headerRow }: Props) => ({
  delimiter,
  quoted,
  headerRow,
})

const csv: Transformer = (props: Props) => () =>
  function (data, state) {
    const options = createOptions(props)

    try {
      return state.rev
        ? (serializeData(data, options) ?? undefined)
        : (normalizeData(data, options) ?? undefined)
    } catch {
      return undefined
    }
  }

export default csv
