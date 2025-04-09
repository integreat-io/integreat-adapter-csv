# CSV adapter for Integreat

Adapter that lets
[Integreat](https://github.com/integreat-io/integreat) parse and stringify CSV.

[![npm Version](https://img.shields.io/npm/v/integreat-adapter-csv.svg)](https://www.npmjs.com/package/integreat-adapter-csv)
[![Maintainability](https://api.codeclimate.com/v1/badges/55c04a2362982d593475/maintainability)](https://codeclimate.com/github/integreat-io/integreat-adapter-csv/maintainability)

## Getting started

### Prerequisits

Requires node v20 and Integreat v1.0.

### Installing and using

Install from npm:

```
npm install integreat-adapter-csv
```

Example of use:

```javascript
import Integreat from 'integreat'
import httpTransporter from 'integreat-transporter-http'
import cvsAdapter from 'integreat-adapter-csv'
import defs from './config.js'

const great = Integreat.create(defs, {
  transporters: { http: httpTransporter },
  adapters: { csv: csvAdapter },
})

// ... and then dispatch actions as usual
```

Example service configuration:

```javascript
{
  id: 'csvfile',
  transporter: 'http',
  adapters: ['csv'],
  endpoints: [
    { options: { delimiter: ';' } }
  ]
}
```

#### Available options

- `delimiter`: Specify what character to use as a delimiter between fields.
  Default is comma `,`.
- `quoted`: When `true`, values will be surrounded by quotes. Default is `true`.
- `headerRow`: When `true`, a header row will be included at as the first row.
  Object keys will be used as header values. Default is `false`.

### Running the tests

The tests can be run with `npm test`.

## Contributing

Please read
[CONTRIBUTING](https://github.com/integreat-io/integreat-adapter-csv/blob/master/CONTRIBUTING.md)
for details on our code of conduct, and the process for submitting pull
requests.

## License

This project is licensed under the ISC License - see the
[LICENSE](https://github.com/integreat-io/integreat-adapter-csv/blob/master/LICENSE)
file for details.
