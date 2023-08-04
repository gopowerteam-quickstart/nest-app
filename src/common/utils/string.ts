export function toUnderscore(str: string) {
  return str
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase()
}
