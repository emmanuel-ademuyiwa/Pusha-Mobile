import React, {useRef, useState} from 'react'

import AppIcon from '../app-icon'
import Box from '../box'
import Button from '../button'
import Divider from '../divider'
import BZModal from '../modal'
import AppPressable from '../pressable'
import Typography from '../typography'

import {DashboardFilter} from '@/libs'
import {Modal} from '@/types/modal'

interface FilterItem {
  name: 'Today' | 'This week' | 'This month' | 'All time'
  enum: DashboardFilter
}

const filterItems: FilterItem[] = [
  {name: 'Today', enum: 'today' as DashboardFilter},
  {name: 'This week', enum: 'this-week' as DashboardFilter},
  {name: 'This month', enum: 'this-month' as DashboardFilter},
  {name: 'All time', enum: 'all-time' as DashboardFilter}
]

interface Props {
  onChange?: (item: DashboardFilter) => void
  variant?: 'tertiary' | 'secondary'
}

export const PeriodFilter = (props: Props) => {
  const {onChange, variant = 'secondary'} = props
  const [currentFilter, setCurrentFilter] = useState<FilterItem>(filterItems[0])

  const modalRef = useRef<Modal>(null)

  const handleFilter = (period: FilterItem) => {
    setCurrentFilter(period)
    if (onChange) onChange(period.enum)
    modalRef.current?.dismiss()
  }

  return (
    <>
      <Button
        label={currentFilter.name}
        size="sm"
        variant={variant}
        onPress={() => modalRef.current?.present()}
        RightIcon={
          <AppIcon
            name="ChevronDown"
            size={16}
            color={ '#333333'}
          />
        }
      />

      {/* Modal */}
      <BZModal ref={modalRef} title="Filter by" snapPoints={[350]}>
        <Box flex={1}>
          {filterItems.map((item, key) => (
            <AppPressable
              key={item.name}
              onPress={() => handleFilter(item)}
              style={{marginTop: key !== 0 ? 8 : 0}}>
              <Box
                paddingVertical={12}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                <Typography variant="body" color="neutral-600">
                  {item.name}
                </Typography>
                {currentFilter.enum === item.enum && (
                  <AppIcon name="check-fill" size={20} color="#1D419B" />
                )}
              </Box>
              {key !== filterItems.length - 1 && <Divider />}
            </AppPressable>
          ))}
        </Box>
      </BZModal>
    </>
  )
}

export default PeriodFilter
