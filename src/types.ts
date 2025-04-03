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

export interface ServiceOptions {}
