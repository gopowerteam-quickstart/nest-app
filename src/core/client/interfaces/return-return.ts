export type ReturnResult<T = any> = void & {
  getData: () => any
  getEntity: () => T
}
