import { useQuery } from '@tanstack/react-query'

import { api } from '@/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export const useDashboardStats = (
  filters: {
    period: string // 'today' | 'this-week' | 'this-month' | 'all-time'
    date_from?: string
    date_to?: string
  },
  enabled = true
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS, filters],
    queryFn: async () => {
      try {
        // Get sales data for the selected period
        // Note: formatDateForAPI removed since we're using date_range object now
        
        const salesResponse = await api.sales.listSales({
          date_range: {
            start: filters.date_from,
            end: filters.date_to,
          },
          limit: 1000 // Get all sales for the period to calculate totals
        })
        
        const allSales = salesResponse?.data?.data?.records || []
        
        // Debug logging to see actual data structure
        console.log('📊 Dashboard Stats Debug:', {
          period: filters.period,
          dateRange: { 
            start: filters.date_from, 
            end: filters.date_to,
          },
          allSalesCount: allSales.length,
          sampleSale: allSales[0] || 'No sales found',
          salesResponse: salesResponse?.data?.data
        })
        
        // Client-side filtering as backup (in case API filtering doesn't work)
        const filterDateRange = {
          from: filters.date_from ? new Date(filters.date_from) : null,
          to: filters.date_to ? new Date(filters.date_to) : null
        }
        
        const sales = allSales.filter((sale: any) => {
          // If no date filters, return all sales
          if (!filterDateRange.from || !filterDateRange.to) {
            return true
          }
          
          // Try different date fields that might exist
          const saleDate = new Date(
            sale.created_at || 
            sale.createdAt || 
            sale.sale_date || 
            sale.date || 
            new Date()
          )
          
          // Skip invalid dates
          if (isNaN(saleDate.getTime())) {
            console.warn('Invalid sale date for filtering:', sale)
            return false
          }
          
          // Check if sale date is within the range
          const isInRange = saleDate >= filterDateRange.from && saleDate <= filterDateRange.to
          
          if (filters.period === 'today') {
            console.log('📅 Today Filter Debug:', {
              saleId: sale.id,
              saleDate: saleDate.toISOString(),
              filterFrom: filterDateRange.from.toISOString(),
              filterTo: filterDateRange.to.toISOString(),
              isInRange
            })
          }
          
          return isInRange
        })
        
        console.log('📊 After Client Filtering:', {
          period: filters.period,
          originalCount: allSales.length,
          filteredCount: sales.length,
          dateRange: filterDateRange
        })
        
        // Calculate total sales amount from individual sale items
        const totalSales = (sales && sales.length > 0) ? sales.reduce((sum: number, sale: any) => {
          // Sum from sale items if available, otherwise use total_amount
          if (sale.sale_items && Array.isArray(sale.sale_items) && sale.sale_items.length > 0) {
            const itemTotal = sale.sale_items.reduce((itemSum: number, item: any) => {
              return itemSum + (item.total_price || item.unit_price * item.quantity || 0)
            }, 0)
            return sum + itemTotal
          }
          return sum + (sale.total_amount || 0)
        }, 0) : 0
        
        // Calculate pending orders based on payment status
        const pendingOrders = sales.filter((sale: any) => 
          sale.payment_status === 'PENDING' || sale.payment_status === 'pending'
        ).length
        
        // Generate sales data based on the period
        const generateSalesDataForPeriod = (period: string, sales: any[]) => {
          switch (period) {
            case 'today':
              // Group by hour for today
              const hourlyData = (sales && sales.length > 0) ? sales.reduce((acc: any, sale: any) => {
                const saleDate = new Date(
                  sale.sale_date || sale.created_at || sale.createdAt || sale.date || new Date()
                )
                
                if (isNaN(saleDate.getTime())) {
                  console.warn('Invalid date for hourly grouping:', sale)
                  return acc
                }
                
                const hour = saleDate.getHours().toString().padStart(2, '0')
                if (!acc[hour]) acc[hour] = 0
                
                const saleAmount = (sale.sale_items && Array.isArray(sale.sale_items) && sale.sale_items.length > 0) 
                  ? sale.sale_items.reduce((sum: number, item: any) => {
                      return sum + (item.total_price || item.unit_price * item.quantity || 0)
                    }, 0) 
                  : sale.total_amount || 0
                
                acc[hour] += saleAmount
                
                // Debug log for today period
                console.log('📅 Hourly Grouping:', {
                  saleId: sale.id,
                  saleDate: saleDate.toISOString(),
                  hour,
                  saleAmount,
                  runningTotal: acc[hour]
                })
                
                return acc
              }, {}) : {}
              
              console.log('📅 Final Hourly Data:', {
                hourlyData,
                totalHours: Object.keys(hourlyData).length,
                totalAmount: Object.values(hourlyData).length > 0 ? Object.values(hourlyData).reduce((sum: number, val: any) => sum + val, 0) : 0
              })
              
              return { hourly: hourlyData }
            
            case 'this-week':
              // Group by day for this week
              const dailyData = (sales && sales.length > 0) ? sales.reduce((acc: any, sale: any) => {
                const saleDate = new Date(
                  sale.sale_date || sale.created_at || sale.createdAt || sale.date || new Date()
                )
                
                if (isNaN(saleDate.getTime())) return acc
                
                const dayName = saleDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
                if (!acc[dayName]) acc[dayName] = 0
                
                const saleAmount = (sale.sale_items && Array.isArray(sale.sale_items) && sale.sale_items.length > 0) 
                  ? sale.sale_items.reduce((sum: number, item: any) => {
                      return sum + (item.total_price || item.unit_price * item.quantity || 0)
                    }, 0) 
                  : sale.total_amount || 0
                
                acc[dayName] += saleAmount
                return acc
              }, {}) : {}
              
              return {
                monday: dailyData.monday || 0,
                tuesday: dailyData.tuesday || 0,
                wednesday: dailyData.wednesday || 0,
                thursday: dailyData.thursday || 0,
                friday: dailyData.friday || 0,
                saturday: dailyData.saturday || 0,
                sunday: dailyData.sunday || 0
              }
            
            case 'this-month':
              // Group by week for this month
              
              const weeklyData = (sales && sales.length > 0) ? sales.reduce((acc: any, sale: any) => {
                const saleDate = new Date(
                  sale.sale_date || sale.created_at || sale.createdAt || sale.date || new Date()
                )
                
                if (isNaN(saleDate.getTime())) return acc
                
                // Calculate which week of the month this sale belongs to
                const dayOfMonth = saleDate.getDate()
                const weekNumber = Math.ceil(dayOfMonth / 7)
                const weekKey = `week${weekNumber}`
                
                if (!acc[weekKey]) acc[weekKey] = 0
                
                const saleAmount = (sale.sale_items && Array.isArray(sale.sale_items) && sale.sale_items.length > 0) 
                  ? sale.sale_items.reduce((sum: number, item: any) => {
                      return sum + (item.total_price || item.unit_price * item.quantity || 0)
                    }, 0) 
                  : sale.total_amount || 0
                
                acc[weekKey] += saleAmount
                return acc
              }, {}) : {}
              
              return { weekly: weeklyData }
            
            default:
              // Default to daily grouping
              const defaultDaily = (sales && sales.length > 0) ? sales.reduce((acc: any, sale: any) => {
                const saleDate = new Date(
                  sale.sale_date || sale.created_at || sale.createdAt || sale.date || new Date()
                )
                
                if (isNaN(saleDate.getTime())) return acc
                
                const dayName = saleDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
                if (!acc[dayName]) acc[dayName] = 0
                
                const saleAmount = (sale.sale_items && Array.isArray(sale.sale_items) && sale.sale_items.length > 0) 
                  ? sale.sale_items.reduce((sum: number, item: any) => {
                      return sum + (item.total_price || item.unit_price * item.quantity || 0)
                    }, 0) 
                  : sale.total_amount || 0
                
                acc[dayName] += saleAmount
                return acc
              }, {}) : {}
              
              return {
                monday: defaultDaily.monday || 0,
                tuesday: defaultDaily.tuesday || 0,
                wednesday: defaultDaily.wednesday || 0,
                thursday: defaultDaily.thursday || 0,
                friday: defaultDaily.friday || 0,
                saturday: defaultDaily.saturday || 0,
                sunday: defaultDaily.sunday || 0
              }
          }
        }
        
        const salesData = generateSalesDataForPeriod(filters.period, sales)
        
        console.log('📊 Generated Sales Data:', {
          period: filters.period,
          salesData,
          totalSales,
          salesCount: sales.length,
          sampleSalesForChart: sales.slice(0, 3).map((sale: any) => ({
            id: sale.id,
            created_at: sale.created_at,
            total_amount: sale.total_amount,
            sale_items: sale.sale_items
          }))
        })
        
        return {
          totalSales,
          pendingOrders,
          totalOrders: sales.length,
          salesData
        }
      } catch {
        // Return default values if API fails
        const getDefaultSalesData = (period: string) => {
          switch (period) {
            case 'today':
              return { hourly: {} }
            case 'this-month':
              return { weekly: {} }
            default:
              return {
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0,
                sunday: 0
              }
          }
        }
        
        return {
          totalSales: 0,
          pendingOrders: 0,
          totalOrders: 0,
          salesData: getDefaultSalesData(filters.period)
        }
      }
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useRecentActivities = (
  query?: {
    limit?: number
    date_from?: string
    date_to?: string
  },
  enabled = true
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RECENT_ACTIVITIES, query],
    queryFn: async () => {
      try {
        // Get recent sales as activities
        const formatDateForAPI = (isoString: string | undefined) => {
          if (!isoString) return undefined
          return new Date(isoString).toISOString().split('T')[0] // YYYY-MM-DD format
        }
        
        const salesResponse = await api.sales.listSales({
          ...query,
          date_range: {
            start: formatDateForAPI(query?.date_from),
            end: formatDateForAPI(query?.date_to),
          },
          limit: query?.limit || 10
        })
        
        const allSales = salesResponse?.data?.data?.records || []
        
        console.log("📱 Recent Activities Debug:", {
          query,
          allSalesCount: allSales.length,
          sampleSale: allSales[0] || 'No sales found',
          salesResponse: salesResponse?.data?.data
        })
        
        // Client-side filtering as backup
        const filterDateRange = {
          from: query?.date_from ? new Date(query.date_from) : null,
          to: query?.date_to ? new Date(query.date_to) : null
        }
        
        const sales = allSales.filter((sale: any) => {
          // If no date filters, return all sales
          if (!filterDateRange.from || !filterDateRange.to) {
            return true
          }
          
          // Try different date fields that might exist
          const saleDate = new Date(
            sale.created_at || 
            sale.createdAt || 
            sale.sale_date || 
            sale.date || 
            new Date()
          )
          
          // Skip invalid dates
          if (isNaN(saleDate.getTime())) {
            return false
          }
          
          // Check if sale date is within the range
          return saleDate >= filterDateRange.from && saleDate <= filterDateRange.to
        })
        
        console.log('📱 After Activities Filtering:', {
          originalCount: allSales.length,
          filteredCount: sales.length,
          dateRange: filterDateRange
        })
        
        // Transform sales into activity format
        const activities = sales.map((sale: any) => ({
          id: sale.id,
          type: 'sale',
          title: 'New sale',
          customer_name: `${sale.customer?.first_name || ''} ${sale.customer?.last_name || ''}`.trim(),
          amount: sale.total_amount,
          items: sale.sale_items,
          created_at: sale.created_at,
          sale_channel: sale.sale_channel
        }))
        
        return activities
      } catch {
        // Return empty array if API fails
        return []
      }
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5 // 5 minutes
  })
}

export const useTopProducts = (
  query?: {
    period?: string
    limit?: number
    date_from?: string
    date_to?: string
  },
  enabled = true
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOP_PRODUCTS, query],
    queryFn: async () => {
      try {
        // Get sales data to analyze top products
        const formatDateForAPI = (isoString: string | undefined) => {
          if (!isoString) return undefined
          return new Date(isoString).toISOString().split('T')[0] // YYYY-MM-DD format
        }
        
        const salesResponse = await api.sales.listSales({
          date_range: {
            start: formatDateForAPI(query?.date_from),
            end: formatDateForAPI(query?.date_to),
          },
          limit: 500 // Get more sales to analyze top products
        })
        
        const allSales = salesResponse?.data?.data?.records || []
        console.log("🏆 Top Products Debug:", {
          period: query?.period,
          dateRange: { date_from: query?.date_from, date_to: query?.date_to },
          allSalesCount: allSales.length,
          sampleSale: allSales[0] || 'No sales found',
          salesResponse: salesResponse?.data?.data
        })
        
        // Client-side filtering as backup
        const filterDateRange = {
          from: query?.date_from ? new Date(query.date_from) : null,
          to: query?.date_to ? new Date(query.date_to) : null
        }
        
        const sales = allSales.filter((sale: any) => {
          // If no date filters, return all sales
          if (!filterDateRange.from || !filterDateRange.to) {
            return true
          }
          
          // Try different date fields that might exist
          const saleDate = new Date(
            sale.created_at || 
            sale.createdAt || 
            sale.sale_date || 
            sale.date || 
            new Date()
          )
          
          // Skip invalid dates
          if (isNaN(saleDate.getTime())) {
            return false
          }
          
          // Check if sale date is within the range
          return saleDate >= filterDateRange.from && saleDate <= filterDateRange.to
        })
        
        console.log('🏆 After Products Filtering:', {
          period: query?.period,
          originalCount: allSales.length,
          filteredCount: sales.length,
          dateRange: filterDateRange
        })
        
        // Aggregate products by sales volume and revenue
        const productStats = new Map()
        
        sales.forEach((sale: any) => {
          sale.sale_items?.forEach((item: any) => {
            const productId = item.product_id
            if (!productStats.has(productId)) {
              productStats.set(productId, {
                product_id: productId,
                product_name: item.product_name || item.name || 'Unknown Product',
                total_quantity: 0,
                total_revenue: 0,
                sales_count: 0
              })
            }
            
            const stats = productStats.get(productId)
            stats.total_quantity += item.quantity || 0
            stats.total_revenue += item.total_price || (item.unit_price * item.quantity) || 0
            stats.sales_count += 1
          })
        })
        
        // Convert to array and sort by total revenue
        let topProducts = Array.from(productStats.values())
          .sort((a, b) => b.total_revenue - a.total_revenue)
          .slice(0, query?.limit || 5)
        
        // If no sales data or no top products, fall back to available products
        if (topProducts.length === 0) {
          const productsResponse = await api.products.listProducts()
          const products = productsResponse?.data?.data?.records || []
          
          // Transform products to match the expected format
          topProducts = products.slice(0, query?.limit || 5).map((product: any) => ({
            product_id: product.id,
            product_name: product.name || 'Unknown Product',
            total_quantity: 0, // No sales data
            total_revenue: 0, // No sales data
            sales_count: 0,
            // Include product details for fallback display
            price: product.price || product.unit_price || 0,
            quantity: product.quantity || 0
          }))
        }
        
        return topProducts
      } catch {
        // Return empty array if API fails
        return []
      }
    },
    enabled,
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // gcTime: 1000 * 60 * 10 // 10 minutes
  })
}