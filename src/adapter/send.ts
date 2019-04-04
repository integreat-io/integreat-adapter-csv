/// <reference path="../../integreat.d.ts" />
import { Request } from 'integreat'
import util = require('util')
import fs = require('fs')

export default function send ({ readFile } = fs) {
  const readFileP = util.promisify(readFile)

  return async (request: Request) => {
    const { fileName = undefined } = request.endpoint || {}

    if (!fileName) {
      throw TypeError('A file name is required')
    }

    const data = await readFileP(fileName)

    return {
      status: 'ok',
      data: data.toString()
    }
  }
}
