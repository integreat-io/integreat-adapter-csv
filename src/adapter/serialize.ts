import { Request } from 'integreat'
import { EndpointOptions } from '.'
import stringify = require('csv-stringify/lib/sync')

interface Data {
  [key: string]: string | number
}

const createOptions = ({ delimiter = ',', quoted = true }) => ({
  delimiter,
  quoted
})

const serializeData = (data: Data[], options: EndpointOptions) =>
  stringify(data, createOptions(options))

export default async function serialize (request: Request<Data[] | null>) {
  return {
    ...request,
    data: (request.data) ? serializeData(request.data, request.endpoint || {}) : null
  }
}
