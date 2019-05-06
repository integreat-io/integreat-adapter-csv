/// <reference path="../../integreat.d.ts" />
import { Request } from 'integreat'
import util = require('util')
import fs = require('fs')

function readOrWrite ({ readFile, writeFile }: typeof fs) {
  const readFileP = util.promisify(readFile)
  const writeFileP = util.promisify(writeFile)

  return async (fileName: string, data: string | null, action: string) =>
    (action === 'SET')
      ? (typeof data === 'string')
        ? writeFileP(fileName, data, 'utf8').then(() => data)
        : Promise.reject(new Error('CSV adapter can only write string to file'))
      : readFileP(fileName)
}

export default function send (theFs = fs) {
  const readOrWriteFn = readOrWrite(theFs)

  return async (request: Request<string | null>) => {
    const { fileName = undefined } = request.endpoint || {}

    if (!fileName) {
      throw TypeError('A file name is required')
    }

    const data = await readOrWriteFn(fileName, request.data, request.action)

    return {
      status: 'ok',
      data: data && data.toString()
    }
  }
}
