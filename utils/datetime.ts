import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

export const formatDate = (date: string | Date, formatString: string = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Invalid date'
    return format(dateObj, formatString)
  } catch {
    return 'Invalid date'
  }
}

export const formatDateTime = (date: string | Date, formatString: string = 'MMM dd, yyyy h:mm a'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Invalid date'
    return format(dateObj, formatString)
  } catch {
    return 'Invalid date'
  }
}

export const formatTime = (date: string | Date, formatString: string = 'h:mm a'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Invalid time'
    return format(dateObj, formatString)
  } catch {
    return 'Invalid time'
  }
}

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Invalid date'
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch {
    return 'Invalid date'
  }
}

export const formatBusinessDate = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy')
}

export const formatBusinessDateTime = (date: string | Date): string => {
  return formatDateTime(date, 'dd/MM/yyyy HH:mm')
}

export const getDateRangeForPeriod = (period: string) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (period) {
    case 'today':
      const startOfToday = new Date(today)
      startOfToday.setHours(0, 0, 0, 0)
      const endOfToday = new Date(today)
      endOfToday.setHours(23, 59, 59, 999)
      
      return {
        date_from: startOfToday.toISOString(),
        date_to: endOfToday.toISOString()
      }
    
    case 'this-week':
      const startOfWeek = new Date(today)
      // Get Monday as start of week (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = today.getDay()
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // If Sunday, go back 6 days, otherwise go back (dayOfWeek - 1) days
      startOfWeek.setDate(today.getDate() - daysFromMonday)
      startOfWeek.setHours(0, 0, 0, 0)
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday
      endOfWeek.setHours(23, 59, 59, 999)
      
      return {
        date_from: startOfWeek.toISOString(),
        date_to: endOfWeek.toISOString()
      }
    
    case 'this-month':
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      startOfMonth.setHours(0, 0, 0, 0)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      endOfMonth.setHours(23, 59, 59, 999)
      
      return {
        date_from: startOfMonth.toISOString(),
        date_to: endOfMonth.toISOString()
      }
    
    default: // 'all-time'
      return {
        date_from: undefined,
        date_to: undefined
      }
  }
}

export const formatCurrency = (amount: number, currency = '₦') => {
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export const getRelativeTimeText = (date: Date | string, baseDate?: Date) => {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const base = baseDate || new Date()
  
  const diffInMs = base.getTime() - targetDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'today'
  } else if (diffInDays === 1) {
    return 'yesterday'
  } else if (diffInDays > 1) {
    return `${diffInDays} days ago`
  } else {
    // Future date
    return 'from future'
  }
}

export const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  
  return Math.round(((current - previous) / previous) * 100)
}