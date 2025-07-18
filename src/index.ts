import normalizeData from './utils/normalize.js'
import serializeData from './utils/serialize.js'
import serializeExcelData from './utils/serializeExcel.js'
import type { Action, Adapter } from 'integreat'
import type { Options } from './types.js'

const allowedOptions = [
  'delimiter',
  'flip',
  'columnPrefix',
  'headerRow',
  'quoted',
  'useExcel',
]

const setDataOnAction = (
  action: Action,
  payloadData: unknown,
  responseData: unknown,
) => ({
  ...action,
  payload:
    action.payload.data === undefined
      ? action.payload
      : { ...action.payload, data: payloadData },
  ...(action.response && {
    response: { ...action.response, data: responseData },
  }),
})

/**
 * The adapter.
 */
const adapter: Adapter = {
  /**
   * Prepare the given options. Will only remove the ones that we don't know.
   */
  prepareOptions(options: Options, _serviceId) {
    return Object.fromEntries(
      Object.entries(options).filter(([key]) => allowedOptions.includes(key)),
    )
  },

  /**
   * Normalize (parse) the csv `data` on `payload` and/or `response` on the
   * given `action`. A `delimiter` may be specified in the options, default is
   * comma `,`.
   */
  async normalize(action, options) {
    let payloadData, responseData

    try {
      payloadData = normalizeData(action.payload.data, options)
    } catch {
      return {
        ...action,
        response: {
          status: 'badrequest',
          error: 'Payload data was not valid CSV',
        },
      }
    }

    try {
      responseData = normalizeData(action.response?.data, options)
    } catch {
      return {
        ...action,
        response: {
          status: 'badresponse',
          error: 'Response data was not valid CSV',
        },
      }
    }

    return setDataOnAction(action, payloadData, responseData)
  },

  /**
   * Serialize (stringify) the `data` on `payload` and/or `response` on the
   * given `action`. A `delimiter` may be specified in the options, default is
   * comma `,`. Quotes will be used around values unless the `quoted` option is
   * set to `false`. To include a header row, set the `headerRow` option to
   * `true`.
   */
  async serialize(action, options) {
    const payloadData = options.useExcel
      ? await serializeExcelData(action.payload.data, options)
      : serializeData(action.payload.data, options)
    const responseData = options.useExcel
      ? await serializeExcelData(action.response?.data, options)
      : serializeData(action.response?.data, options)

    return setDataOnAction(action, payloadData, responseData)
  },
}

export default adapter
