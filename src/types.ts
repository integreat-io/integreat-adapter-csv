export interface Options extends Record<string, unknown> {
  delimiter?: string
  quoted?: boolean
  columnPrefix?: string
  headerRow?: boolean
  fileName?: string
}
