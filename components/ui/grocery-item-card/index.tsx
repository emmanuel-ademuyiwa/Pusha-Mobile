import {AppIcon, Box, Button, Typography} from '@/components/ui'
import {Image} from 'expo-image'
import React from 'react'
import {FlatList, StyleSheet} from 'react-native'

const COLUMN_GAP = 12
const ROW_GAP = 16
const NUM_COLUMNS = 3

export type GroceryItem = {
  id: string
  name: string
  price: string
  imageSource: number | {uri: string}
}

export type GroceryItemCardProps = GroceryItem & {
  onAddPress?: () => void
  onPress?: () => void
}

export function GroceryItemCard({
  name,
  price,
  imageSource,
  onAddPress
}: GroceryItemCardProps) {
  return (
    <Box flex={1} minWidth={0}>
      <Box style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} contentFit="contain" />
        <Box position="absolute" bottom={12} right={8}>
          <Button
            iconButton
            iconSize="md"
            variant="primary"
            borderWidth={0}
            Icon={<AppIcon name="Plus" size={18} color="#45505F" />}
            onPress={onAddPress}
          />
        </Box>
      </Box>

      <Box mt={2}>
        <Typography
          variant="body-semibold"
          color="neutral-1000"
          lineHeight={16}
          numberOfLines={1}>
          {name}
        </Typography>
        <Typography
          variant="body-medium"
          color="neutral-700"
          lineHeight={16}>
          {price}
        </Typography>
      </Box>
    </Box>
  )
}

type GroceryItemListProps = {
  data: GroceryItem[]
  numColumns?: number
  onAddPress?: (item: GroceryItem) => void
  onItemPress?: (item: GroceryItem) => void
}

export function GroceryItemList({
  data,
  numColumns = NUM_COLUMNS,
  onAddPress,
  onItemPress
}: GroceryItemListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      numColumns={numColumns}
      scrollEnabled={false}
      columnWrapperStyle={styles.columnWrapper}
      ItemSeparatorComponent={() => <Box height={ROW_GAP} />}
      renderItem={({item}) => (
        <GroceryItemCard
          {...item}
          onAddPress={() => onAddPress?.(item)}
          onPress={() => onItemPress?.(item)}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  imageWrapper: {
    borderRadius: 12,
    overflow: 'visible'
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden'
  },
  columnWrapper: {
    gap: COLUMN_GAP
  }
})

export default GroceryItemCard
