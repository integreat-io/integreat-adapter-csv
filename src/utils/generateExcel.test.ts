import test from 'node:test'
import assert from 'node:assert/strict'

import generateExcelWorkbook, {
  generateExcelWorksheet,
  colLettersFromIndex,
} from './generateExcel.js'

// Setup

const rows = [
  ['John F.', 45, 'Fjonveien 18'],
  ['Mary K. & Lucy S.', 52, 'Kvølstadbakken 11'],
  ['Simon P.', 23, 'Praiestakken 21A'],
]

const wrapInWorksheet = (content: string) => `<?xml version="1.0" ?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><sheetData>${content}</sheetData></worksheet>`

// Tests -- generateExcelWorksheet

test('should create an Excel file from array of rows', () => {
  const expected = wrapInWorksheet(
    [
      '<row r="1">',
      '<c r="A1" t="inlineStr"><is><t>John F.</t></is></c>',
      '<c r="B1" t="n"><v>45</v></c>',
      '<c r="C1" t="inlineStr"><is><t>Fjonveien 18</t></is></c>',
      '</row>',
      '<row r="2">',
      '<c r="A2" t="inlineStr"><is><t>Mary K. &amp; Lucy S.</t></is></c>',
      '<c r="B2" t="n"><v>52</v></c>',
      '<c r="C2" t="inlineStr"><is><t>Kvølstadbakken 11</t></is></c>',
      '</row>',
      '<row r="3">',
      '<c r="A3" t="inlineStr"><is><t>Simon P.</t></is></c>',
      '<c r="B3" t="n"><v>23</v></c>',
      '<c r="C3" t="inlineStr"><is><t>Praiestakken 21A</t></is></c>',
      '</row>',
    ].join(''),
  )

  const ret = generateExcelWorksheet(rows)

  assert.equal(ret, expected)
})

test('should create an Excel file from array of rows with columns', () => {
  const columns = ['Name', 'Age', 'Address']
  const expected = wrapInWorksheet(
    [
      '<row r="1">',
      '<c r="A1" s="1" t="inlineStr"><is><t>Name</t></is></c>',
      '<c r="B1" s="1" t="inlineStr"><is><t>Age</t></is></c>',
      '<c r="C1" s="1" t="inlineStr"><is><t>Address</t></is></c>',
      '</row>',
      '<row r="2">',
      '<c r="A2" t="inlineStr"><is><t>John F.</t></is></c>',
      '<c r="B2" t="n"><v>45</v></c>',
      '<c r="C2" t="inlineStr"><is><t>Fjonveien 18</t></is></c>',
      '</row>',
      '<row r="3">',
      '<c r="A3" t="inlineStr"><is><t>Mary K. &amp; Lucy S.</t></is></c>',
      '<c r="B3" t="n"><v>52</v></c>',
      '<c r="C3" t="inlineStr"><is><t>Kvølstadbakken 11</t></is></c>',
      '</row>',
      '<row r="4">',
      '<c r="A4" t="inlineStr"><is><t>Simon P.</t></is></c>',
      '<c r="B4" t="n"><v>23</v></c>',
      '<c r="C4" t="inlineStr"><is><t>Praiestakken 21A</t></is></c>',
      '</row>',
    ].join(''),
  )

  const ret = generateExcelWorksheet(rows, columns)

  assert.equal(ret, expected)
})

// Tests -- colLettersFromIndex

test('should return letters from index', () => {
  assert.equal(colLettersFromIndex(0), 'A')
  assert.equal(colLettersFromIndex(1), 'B')
  assert.equal(colLettersFromIndex(25), 'Z')
  assert.equal(colLettersFromIndex(26), 'AA')
  assert.equal(colLettersFromIndex(27), 'AB')
  assert.equal(colLettersFromIndex(51), 'AZ')
  assert.equal(colLettersFromIndex(52), 'BA')
  assert.equal(colLettersFromIndex(701), 'ZZ')
  assert.equal(colLettersFromIndex(702), 'AAA')
})

// Tests -- generateExcelWorkbook

test('should return Excel file', async () => {
  const ret = await generateExcelWorkbook(rows)

  // Verify the first and the last chars of the file
  assert.equal(ret.slice(0, 13), 'UEsDBAoAAAAAA')
  assert.equal(ret.slice(-6), 'AAAAA=')
})
