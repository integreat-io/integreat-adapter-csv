# CSV/Excel adapter for Integreat

Adapter that lets
[Integreat](https://github.com/integreat-io/integreat) parse and stringify CSV
and simple Excel files.

[![npm Version](https://img.shields.io/npm/v/integreat-adapter-csv.svg)](https://www.npmjs.com/package/integreat-adapter-csv)
[![Maintainability](https://qlty.sh/badges/d0e38625-0a7d-413b-bd42-bd9c95169ccd/maintainability.svg)](https://qlty.sh/gh/integreat-io/projects/integreat-adapter-csv)

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

- `columnPrefix`: By default, the keys of a data object will be the values of
  the header row, or, if there's no header row, `col1`, `col2`, etc. To have
  something other than `col1` etc., you may set `columnPrefix`, and it will be
  prepended to the column number. E.g. `columnPrefix: 'Field '` will give you
  `Field 1`, `Field 2`, etc. When there's a header row, `columnPrefix` will be
  disregarded.
- `delimiter`: Specify what character to use as a delimiter between fields.
  Default is comma `,`.
- `headerRow`: If `true`, the first row will be treated as a header row when
  parsing a CSV _from_ a service, and a header row will be inserted when
  generating a CSV _to_ a service. In both these examples, header row values
  will equal object keys. Default is `false`.
- `quoted`: When `true`, values will be surrounded by quotes. Default is `true`.
- `useExcel`: When `true`, the adapter will expect a Base64 encoded Excel file
  instead of a CSV string, and will output Base64 Excel files. This should be
  simple Excel files that is just like CSVs in every way except the format. If
  reading an Excel file with more than one sheet, only the first one will be
  considered. When `useExcel` is true, the `delimiter` and `quoted` options are
  disregarded. Default is `false`.

### CSV transformer

The package also includes a CSV transformer, that works exactly like the
adapter, except it is intended for use in mutation pipelines with
`{ $transform: 'csv' }`.

Note that it will transform from a CSV string to an array of data objects when
coming _from_ a service, and does the opposite going _to_ a service. When the
transform is inside a flipped mutation object (i.e. `$flip: true` is set), the
direction of the transformer is also flipped. You may also flip the direction
by setting property `flip: true` on the `csv` transform object.

You may use the transformer like this:

```javascript
import integreat from 'integreat'
import httpTransporter from 'integreat-transporter-http'
import csvTransformer from 'integreat-adapter-csv/transformer.js'
import defs from './config.js'

const great = Integreat.create(defs, {
  transporters: { http: httpTransporter },
  transformers: { csv: csvTransformer },
})

// In a mutation pipeline:

const mutation = ['response.data', { $transform: 'csv', delimiter: ';' }]
```

All the options from the adapter can be used as arguments on the transform
object, except the `useExcel` option (see the
[Excel transformer](#excel-transformer) if you want Excel). In addition, you may
flip the direction of the transformer by setting `flip: true`.

### Excel transformer

The package also includes an Excel transformer, that works exactly like the
adapter with the `useExcel: true` option, except it is intended for use in
mutation pipelines with `{ $transform: 'excel' }`.

Note that it will transform from a Base64 encoded Excel file to an array of data
objects when coming _from_ a service, and does the opposite going _to_ a
service. When the transform is inside a flipped mutation object (i.e.
`$flip: true` is set), the direction of the transformer is also flipped. You may
also flip the direction by setting property `flip: true` on the `excel`
transform object.

You may use the transformer like this:

```javascript
import integreat from 'integreat'
import httpTransporter from 'integreat-transporter-http'
import excelTransformer from 'integreat-adapter-csv/excelTransformer.js'
import defs from './config.js'

const great = Integreat.create(defs, {
  transporters: { http: httpTransporter },
  transformers: { excel: excelTransformer },
})

// In a mutation pipeline:

const mutation = ['response.data', { $transform: 'excel' }]
```

All the options from the adapter can be used as arguments on the transform
object, except the `useExcel` option (see the
[CSV transformer](#csv-transformer) if you want CSV), and the `delimiter` and
`quoted` options (they don't make sense for Excel). In addition, you may flip
the direction of the transformer by setting `flip: true`.

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
