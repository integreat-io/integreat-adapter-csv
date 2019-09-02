import send from './send'
import serialize from './serialize'
import normalize from './normalize'

type DataProperty = string | number | boolean | object

interface Data {
  [key: string]: DataProperty
}

export type RequestData = Data | Data[] | DataProperty | null

export interface Request {
  method: string
  data?: RequestData
  endpoint?: EndpointOptions
}

export interface Response {
  status: string
  data?: any
  error?: string
}

export interface EndpointOptions {
  delimiter?: string
  quoted?: boolean
  columnPrefix?: string
  headerRow?: boolean
  fileName?: string
}

export interface ServiceOptions {
}

export default {
  authentication: null,

  prepareEndpoint: (endpointOptions: EndpointOptions, _serviceOptions?: ServiceOptions) => endpointOptions,

  connect: async (_serviceOptions: ServiceOptions, _auth: object | null, _connection: object | null) => null,
  serialize,

  send: send(),

  normalize,

  disconnect: async (_connection: {} | null) => { return }
}
