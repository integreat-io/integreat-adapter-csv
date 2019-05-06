/// <reference path="../../integreat.d.ts" />
import { Response, Request } from 'integreat'
import { EndpointOptions } from '.'
import parse = require('csv-parse/lib/sync')

const createOptions = ({ delimiter = ',' }) => ({
  skip_empty_lines: true,
  trim: true,
  delimiter
})

const normalizeLine = (columnPrefix = 'col') => (fields: string[]) => fields.reduce(
  (item, value, index) => ({ ...item, [`${columnPrefix}${ index + 1 }`]: value }), {}
)

const normalizeData = (data: string, options: EndpointOptions) =>
  parse(data, createOptions(options)).map(normalizeLine(options.columnPrefix))

export default async function normalize (response: Response<string | null>, request: Request<string | null>) {
  try {
    return {
      ...response,
      data: (response.data) ? normalizeData(response.data, request.endpoint || {}) : null
    }
  } catch (error) {
    throw new Error('Invalid csv format')
  }
}
