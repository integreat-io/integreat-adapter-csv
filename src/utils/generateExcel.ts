import JSZip from 'jszip'
import escape from 'lodash.escape'

const workbookXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><workbookPr/><sheets><sheet state="visible" name="Sheet1" sheetId="1" r:id="rId3"/></sheets><definedNames/><calcPr/></workbook>`
const workbookXMLRels = `<?xml version="1.0" ?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Target="styles.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"/>
<Relationship Id="rId3" Target="worksheets/sheet1.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"/>
</Relationships>`
const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`
const contentTypes = `<?xml version="1.0" ?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default ContentType="application/xml" Extension="xml"/>
<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>
<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/worksheets/sheet1.xml"/>
<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" PartName="/xl/workbook.xml"/>
<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" PartName="/xl/styles.xml"/>
</Types>`
const stylesXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font>
  </fonts>
  <fills count="2">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
  </fills>
  <borders count="1">
    <border></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0"/>
  </cellXfs>
</styleSheet>`

const worksheetPre = `<?xml version="1.0" ?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><sheetData>`
const worksheetPost = '</sheetData></worksheet>'

/**
 * Will return the Excel column letters representing the given 0-based index.
 * The sequence will be A, B, C, ... Z, AA, AB, AC, ... AZ, BA, BB, ... ZZ, AAA.
 */
export function colLettersFromIndex(index: number): string {
  let result = ''
  let currentIndex = index

  do {
    result = String.fromCharCode(65 + (currentIndex % 26)) + result
    currentIndex = Math.floor(currentIndex / 26) - 1
  } while (currentIndex >= 0)

  return result
}

/**
 * Generates the XML for one cell. Will format the cell as number or inline
 * text, depending on the type of the `value`. No other formatting is done.
 */
function generateCell(rowNum: number) {
  return (value: unknown, index: number) => {
    const cellNum = `${colLettersFromIndex(index)}${rowNum}`
    if (typeof value === 'number') {
      return `<c r="${cellNum}" t="n"><v>${value}</v></c>`
    } else {
      return `<c r="${cellNum}" t="inlineStr"><is><t>${escape(value)}</t></is></c>`
    }
  }
}

/**
 * Generate the XML for a header row with the given column headers.
 */
function generateHeaderRow(columns: (string | undefined)[]) {
  const content = columns
    .map((column, index) => {
      const cellNum = `${colLettersFromIndex(index)}1`
      return `<c r="${cellNum}" s="1" t="inlineStr"><is><t>${escape(column ?? '')}</t></is></c>`
    })
    .join('')
  return `<row r="1">${content}</row>`
}

/**
 * Generates the XML for one row of cell data.
 */
function generateRow(startRow: number) {
  return (row: unknown[], index: number) => {
    const rowNum = index + startRow
    const cells = row.map(generateCell(rowNum)).join('')
    return `<row r="${rowNum}">${cells}</row>`
  }
}

/**
 * Takes an array of row data and returns the XML of an Excel worksheet.
 * Will distinguish between numbers and strings, but no other formatting.
 */
export function generateExcelWorksheet(
  rows: unknown[][],
  columns?: (string | undefined)[],
) {
  const headerRow = columns ? generateHeaderRow(columns) : ''
  const startRow = columns ? 2 : 1
  const content = rows.map(generateRow(startRow)).join('')
  return `${worksheetPre}${headerRow}${content}${worksheetPost}`
}

export default async function generateExcelWorkbook(
  rows: unknown[][],
  columns?: (string | undefined)[],
) {
  const worksheet = generateExcelWorksheet(rows, columns)

  const zip = new JSZip()
  const xl = zip.folder('xl')
  if (!xl) {
    throw new Error('Could not create Excel workbook')
  }

  xl.file('workbook.xml', workbookXML)
  xl.file('styles.xml', stylesXML)
  xl.file('_rels/workbook.xml.rels', workbookXMLRels)
  zip.file('_rels/.rels', rels)
  zip.file('[Content_Types].xml', contentTypes)
  xl.file('worksheets/sheet1.xml', worksheet)

  return zip.generateAsync({
    type: 'base64',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}
