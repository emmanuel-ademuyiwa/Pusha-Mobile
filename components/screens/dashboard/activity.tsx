import Box from '@/components/ui/box'
import Typography from '@/components/ui/typography'
import React from 'react'

interface ActivityItem {
  id?: string
  type?: string
  title?: string
  description?: string
  customer_name?: string
  amount?: number
  items?: any[]
}

interface ActivityProps {
  data?: ActivityItem[]
}

const getBorderColor = (type?: string) => {
  switch (type) {
    case 'customer':
      return '#2554CF'
    case 'low_stock':
      return '#F0960F'
    case 'sale':
    default:
      return '#1FC16B'
  }
}

const Activity = ({data = []}: ActivityProps) => {
  if (data.length === 0) {
    return (
      <Box alignItems="center" justifyContent="center" py={24}>
        <Typography variant="body" color="neutral-600">
          No recent activity
        </Typography>
      </Box>
    )
  }

  return (
    <Box gap={12}>
      {data.map((item, i) => {
        const subtitle =
          item.customer_name ||
          item.items?.[0]?.product_name ||
          item.items?.[0]?.name ||
          ''
        const borderColor = getBorderColor(item.type)
        const unitsSold =
          item.items?.reduce(
            (sum: number, si: any) => sum + (si.quantity || 0),
            0,
          ) || 0

        return (
          <Box
            key={item.id ?? i}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            style={{
              borderLeftWidth: 3,
              borderLeftColor: borderColor,
              paddingLeft: 12,
            }}>
            <Box flex={1} mr={8}>
              <Typography variant="c1-medium" color="secondary-500">
                {item.title || item.description || 'Activity'}
                {subtitle ? `: ${subtitle}` : ''}
              </Typography>
            </Box>
            <Box alignItems="flex-end">
              {item.amount ? (
                <Typography variant="c1-bold" color="secondary-500">
                  ₦{Number(item.amount).toLocaleString()}
                </Typography>
              ) : null}
              {unitsSold > 0 ? (
                <Typography variant="c2" color="neutral-600">
                  {unitsSold} units sold
                </Typography>
              ) : null}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default Activity
