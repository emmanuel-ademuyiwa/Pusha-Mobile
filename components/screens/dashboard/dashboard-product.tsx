import {Box, Typography} from '@/components/ui'
import {Image} from 'expo-image'
import {router} from 'expo-router'
import React from 'react'
import {TouchableOpacity} from 'react-native'

interface DashboardProductProps {
  item: {
    id?: string
    name?: string
    price?: number
    image?: string
    stock?: number
    [key: string]: any
  }
}

const DashboardProduct = ({item}: DashboardProductProps) => {
  return (
    <TouchableOpacity
      onPress={() => item.id && router.push(`/products/${item.id}` as any)}
      activeOpacity={0.8}>
      <Box
        backgroundColor="white"
        borderRadius={12}
        overflow="hidden"
        style={{width: 140}}>
        <Box height={100} backgroundColor="neutral-100">
          {item.image ? (
            <Image source={{uri: item.image}} style={{flex: 1}} contentFit="cover" />
          ) : null}
        </Box>
        <Box p={8}>
          <Typography variant="c1-bold" color="secondary-500" numberOfLines={1}>
            {item.name || 'Product'}
          </Typography>
          <Typography variant="c2" color="neutral-600" mt={2}>
            ₦{item.price ? Number(item.price).toLocaleString() : '0'}
          </Typography>
        </Box>
      </Box>
    </TouchableOpacity>
  )
}

export default DashboardProduct
