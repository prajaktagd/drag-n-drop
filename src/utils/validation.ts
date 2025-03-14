type Validatable = {
  value: string | number
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

export const validate = (validatable: Validatable) => {
  const {value} = validatable
  if (validatable.required && !value.toString().trim().length)
    return false
  if (validatable.minLength !== undefined && typeof value === 'string'
    && value.length < validatable.minLength)
    return false
  if (validatable.maxLength !== undefined && typeof value === 'string'
    && value.length > validatable.maxLength)
    return false
  if (validatable.min !== undefined && typeof value === 'number'
    && value < validatable.min)
    return false
  return !(validatable.max !== undefined && typeof value === 'number'
    && value > validatable.max)
}
