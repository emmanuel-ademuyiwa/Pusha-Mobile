import {api} from '@/api'
import {Box, Button, Container, Typography} from '@/components/ui'
import {errorHandler} from '@/utils/errorHandler'
import React, {useState} from 'react'
import {ScrollView} from 'react-native'

interface BankDetailsProps {
  handleNext: () => void
}

const BankDetails = ({handleNext}: BankDetailsProps) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      handleNext()
    } catch (err) {
      errorHandler(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Container>
        <Box mt={24} gap={16}>
          <Typography variant="h2-bold" color="secondary-500">
            Bank Details
          </Typography>
          <Typography variant="body" color="neutral-600">
            Add your bank account for withdrawals.
          </Typography>
          <Box mt={8}>
            <Button label="Continue" loading={loading} onPress={handleSubmit} />
          </Box>
        </Box>
      </Container>
    </ScrollView>
  )
}

export default BankDetails
