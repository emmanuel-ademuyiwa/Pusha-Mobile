export const formatIntegerFields = (value: string) => {
  // Remove non-digit characters except for the decimal point
  const cleanedValue = value.replace(/[^\d.]/g, '')

  // Split the value into integer and fractional parts
  const [integerPart, fractionalPart] = cleanedValue.split('.')

  // Format the integer part with commas for thousands separator
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // Concatenate the integer part with the fractional part (if exists)
  const formattedValue =
    fractionalPart !== undefined
      ? `${formattedIntegerPart}.${fractionalPart}`
      : formattedIntegerPart

  return formattedValue
}

export const formatNumberField = (value: string) => {
  const cleanedValue = value.replace(/[^\d.]/g, '')
  return cleanedValue
}

export const formatWholeNumber = (value: string) => {
  const cleanedValue = value.replace(/[^\d]/g, '')

  return formatIntegerFields(cleanedValue)
}
