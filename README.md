# CSV adapter for Integreat

Adapter that lets
[Integreat](https://github.com/integreat-io/integreat) read and save CSV files.

[![npm Version](https://img.shields.io/npm/v/integreat-adapter-csv.svg)](https://www.npmjs.com/package/integreat-adapter-csv)
[![Build Status](https://travis-ci.org/integreat-io/integreat-adapter-csv.svg?branch=master)](https://travis-ci.org/integreat-io/integreat-adapter-csv)
[![Coverage Status](https://coveralls.io/repos/github/integreat-io/integreat-adapter-csv/badge.svg?branch=master)](https://coveralls.io/github/integreat-io/integreat-adapter-csv?branch=master)
[![Dependencies Status](https://tidelift.com/badges/github/integreat-io/integreat-adapter-csv?style=flat)](https://tidelift.com/repo/github/integreat-io/integreat-adapter-csv)
[![Maintainability](https://api.codeclimate.com/v1/badges/55c04a2362982d593475/maintainability)](https://codeclimate.com/github/integreat-io/integreat-adapter-csv/maintainability)

## Getting started

### Prerequisits

Requires node v8.6 and Integreat v0.7.

### Installing and using

Install from npm:

```
npm install integreat-adapter-csv
```

Example of use:
```javascript
const integreat = require('integreat')
const cvsAdapter = require('integreat-adapter-csv')
const defs = require('./config')

const resources = integreat.resources(csvAdapter)
const great = integreat(defs, resources)

// ... and then dispatch actions as usual
```

Example source configuration:

```javascript
{
  id: 'csvfile',
  adapter: 'csv',
  endpoints: [
    { options: { delimiter: ';' } }
  ]
}
```

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
