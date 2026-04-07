import {Box, Typography} from '@/components/ui'
import {type IProduct} from '@/queries/productsQuery'
import {Image} from 'expo-image'
import {router} from 'expo-router'
import React from 'react'
import {TouchableOpacity} from 'react-native'
import {ProductBadge} from './product-badge'

interface ProductProps {
  item: IProduct
  onPress?: () => void
}

const Product = ({item, onPress}: ProductProps) => {
  const image = item.images?.[0] ?? null
  const price = item.discount_price > 0 ? item.discount_price : item.unit_price
  const badgeType = item.is_available ? 'available' : 'unavailable'

  const handlePress = () => {
    if (onPress) return onPress()
    router.push(`/products/${item.id}` as any)
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Box
        backgroundColor="white"
        borderRadius={12}
        overflow="hidden"
        borderWidth={1}
        style={{borderColor: '#E9EAEB'}}>
        {/* Image with badge overlay */}
        <Box height={130} backgroundColor="neutral-100">
          {image ? (
            <Image source={{uri: image}} style={{flex: 1}} contentFit="cover" />
          ) : null}
          <Box style={{position: 'absolute', top: 8, left: 8}}>
            <ProductBadge type={badgeType} />
          </Box>
        </Box>

        {/* Info */}
        <Box p={10} gap={2}>
          {item.brand ? (
            <Typography variant="c2" color="neutral-600">
              {item.brand}
            </Typography>
          ) : null}
          <Typography variant="body-semibold" color="secondary-500" numberOfLines={2}>
            {item.name}
          </Typography>
          <Typography variant="c1-bold" color="secondary-500" mt={4}>
            ₦{Number(price).toLocaleString()}
          </Typography>
          {item.discount_price > 0 ? (
            <Typography
              variant="c2"
              color="neutral-600"
              style={{textDecorationLine: 'line-through'}}>
              ₦{Number(item.unit_price).toLocaleString()}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </TouchableOpacity>
  )
}

export default Product
