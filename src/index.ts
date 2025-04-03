import normalizeData from './utils/normalize.js'
import serializeData from './utils/serialize.js'
import type { Action, Adapter } from 'integreat'
import type { Options } from './types.js'

const allowedOptions = [
  'delimiter',
  'quoted',
  'columnPrefix',
  'headerRow',
  'fileName',
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

const adapter: Adapter = {
  prepareOptions(options: Options, _serviceId) {
    return Object.fromEntries(
      Object.entries(options).filter(([key]) => allowedOptions.includes(key)),
    )
  },

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

  async serialize(action, options) {
    const payloadData = serializeData(action.payload.data, options)
    const responseData = serializeData(action.response?.data, options)

    return setDataOnAction(action, payloadData, responseData)
  },
}

export default adapter
