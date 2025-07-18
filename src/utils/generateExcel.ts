import JSZip from 'jszip'
import escape from 'lodash.escape'

const workbookXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><workbookPr/><sheets><sheet state="visible" name="Sheet1" sheetId="1" r:id="rId3"/></sheets><definedNames/><calcPr/></workbook>`
const workbookXMLRels = `<?xml version="1.0" ?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
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
</Types>`

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
      return `<c r="${cellNum}"><v>${value}</v></c>`
    } else {
      return `<c r="${cellNum}" t="inlineStr"><is><t>${escape(value)}</t></is></c>`
    }
  }
}

/**
 * Generates the XML for one row of cell data.
 */
function generateRow(row: unknown[], index: number) {
  const rowNum = index + 1
  const cells = row.map(generateCell(rowNum)).join('')
  return `<row r="${rowNum}">${cells}</row>`
}

/**
 * Takes an array of row data and returns the XML of an Excel worksheet.
 * Will distinguish between numbers and strings, but no other formatting.
 */
export function generateExcelWorksheet(rows: unknown[][]) {
  const content = rows.map(generateRow).join('')
  return `${worksheetPre}${content}${worksheetPost}`
}

export default async function generateExcelWorkbook(rows: unknown[][]) {
  const worksheet = generateExcelWorksheet(rows)

  const zip = new JSZip()
  const xl = zip.folder('xl')
  if (!xl) {
    throw new Error('Could not create Excel workbook')
  }

  xl.file('workbook.xml', workbookXML)
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
