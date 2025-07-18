export interface Options extends Record<string, unknown> {
  delimiter?: string
  flip?: true
  quoted?: boolean
  columnPrefix?: string
  headerRow?: boolean
  useExcel?: boolean
  columnHeaders?: Record<string, string>
}
