import React from 'react'
import CautionIcon from '../svgs/caution-icon'
import {Box, Button, Typography} from '../ui'
import CenterdModal from '../ui/centerd-modal'

const DeleteProductModal = ({
  show,
  onClose,
  handleDelete
}: {
  show: boolean
  onClose: () => void
  handleDelete: () => void
}) => {
  return (
    <CenterdModal visible={show} onClose={onClose}>
      <Box alignItems="center" width={'100%'}>
        <CautionIcon />
        <Typography
          variant="h1-bold"
          color="secondary-500"
          fontSize={22}
          lineHeight={33}>
          Delete product
        </Typography>
        <Typography
          my={16}
          textAlign="center"
          color="neutral-800"
          variant="body">
          Are you sure you want to delete this product? It will no longer
          reflect on your online store.
        </Typography>

        <Box mt={16} width={'100%'} flexDirection="row" gap={16}>
          <Box flex={1}>
            <Button
              variant="outline"
              label="Cancel"
              onPress={onClose}
              hasLinearGradient={false}
              textColor={'neutral-600'}
            />
          </Box>
          <Box flex={1}>
            <Button
              label="Delete"
              hasLinearGradient={false}
              backgroundColor="red-alpha"
              borderWidth={0}
              onPress={handleDelete}
              textColor={'red-100'}
            />
          </Box>
        </Box>
      </Box>
    </CenterdModal>
  )
}

export default DeleteProductModal
