export const formatCurrencyFields = (value: string) => {
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

export const formatCurrency = (
  amount?: string | number,
  format?: 'short' | 'comma',
  currency?: string
) => {
  // Set default values for currency and format
  currency = currency || '₦'
  format = format || 'comma'
  const value = Number(amount || 0)

  if (isNaN(value)) {
    formatCurrency(0, format, currency)
  }

  if (format === 'comma') {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'decimal', // Or 'currency' for currency formatting
      minimumFractionDigits: 0, // Minimum number of decimal places
      maximumFractionDigits: 2 // Maximum number of decimal places
    })

    return `${currency}${formatter.format(value)}`
    // return `${currency}${value.toLocaleString()}`
  } else if (format === 'short') {
    const ranges = [
      {divider: 1e18, suffix: 'BT'},
      {divider: 1e15, suffix: 'MT'},
      {divider: 1e12, suffix: 'T'},
      {divider: 1e9, suffix: 'B'},
      {divider: 1e6, suffix: 'M'},
      {divider: 1e3, suffix: 'K'}
    ]

    for (const range of ranges) {
      if (value >= range.divider) {
        const newValue = value / range.divider
        const displayValue = parseFloat(newValue.toFixed(2))
        return `${currency}${displayValue.toLocaleString('en') + range.suffix}`
      }
    }
    return `${currency}${value.toFixed(2)}`
  }
}

export function calculateTransactionFee(amount: number): number {
  const fee = 0.02 * amount + 100

  return Math.min(fee, 5000)
}
