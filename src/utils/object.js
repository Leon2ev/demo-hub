export const isNullishOrUndefined = obj => {
  Object.values(obj).every(value => {
    if (value === null || value === undefined) return true
    return false
  })
}