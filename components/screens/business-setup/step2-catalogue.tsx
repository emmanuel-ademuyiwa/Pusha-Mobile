import {api} from '@/api'
import {AppIcon, Box, Button, Container, TextField, Typography} from '@/components/ui'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {errorHandler} from '@/utils/errorHandler'
import React, {useState} from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import uuid from 'react-native-uuid'

interface Step2CatalogueProps {
  handleNext: () => void
  handleBack: () => void
}

interface PendingProduct {
  id: string
  name: string
  brand: string
  price: string
}

const Step2Catalogue = ({handleNext, handleBack}: Step2CatalogueProps) => {
  const [draftName, setDraftName] = useState('')
  const [draftBrand, setDraftBrand] = useState('')
  const [draftPrice, setDraftPrice] = useState('')
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canAddProduct =
    draftName.trim().length > 0 &&
    draftPrice.trim().length > 0 &&
    Number(draftPrice) > 0

  const handleAddProduct = () => {
    if (!canAddProduct) return
    setPendingProducts(prev => [
      ...prev,
      {
        id: uuid.v4() as string,
        name: draftName.trim(),
        brand: draftBrand.trim(),
        price: draftPrice.trim()
      }
    ])
    setDraftName('')
    setDraftBrand('')
    setDraftPrice('')
  }

  const handleRemoveProduct = (id: string) => {
    setPendingProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleContinue = async () => {
    if (pendingProducts.length === 0) {
      handleNext()
      return
    }
    try {
      setIsSubmitting(true)
      await Promise.all(
        pendingProducts.map(p =>
          api.products.createProduct({
            name: p.name,
            brand: p.brand || undefined,
            selling_price: Number(p.price)
          } as any)
        )
      )
      handleNext()
    } catch (err) {
      errorHandler(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <KeyboardAwareScrollView>
      <Container>
        <Box mt={16} gap={20} pb={32}>
          <Box gap={4}>
            <Typography variant="c1-medium" color="primary-300">
              Step 2 of 4
            </Typography>
            <Typography variant="h2-bold" color="secondary-500">
              Build your catalogue
            </Typography>
            <Typography variant="body" color="neutral-500">
              Add your products so your AI knows exactly what to sell
            </Typography>
          </Box>

          {/* Manual entry form */}
          <Box
            style={styles.formCard}
            gap={12}
            padding={16}
            borderRadius={16}>
            <TextField
              name="productName"
              placeholder="Product name  e.g. Ankara Dress"
              value={draftName}
              onChangeText={setDraftName}
            />
            <TextField
              name="productBrand"
              placeholder="Brand  e.g. Adaeze Collection (optional)"
              value={draftBrand}
              onChangeText={setDraftBrand}
            />
            <TextField
              name="productPrice"
              placeholder="Price  e.g. 5000"
              keyboardType="numeric"
              inputMode="numeric"
              value={draftPrice}
              onChangeText={setDraftPrice}
              prefix="₦"
            />
            <Button
              variant="outline"
              label="Add Product"
              disabled={!canAddProduct}
              onPress={handleAddProduct}
            />
          </Box>

          {/* Pending products list */}
          {pendingProducts.length > 0 && (
            <Box gap={8}>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                <Typography variant="body-bold" color="secondary-500">
                  {pendingProducts.length} product
                  {pendingProducts.length !== 1 ? 's' : ''} added
                </Typography>
                <Box
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={20}
                  backgroundColor="primary-100">
                  <Typography variant="c1-medium" color="primary-300">
                    Ready
                  </Typography>
                </Box>
              </Box>
              {pendingProducts.map(p => (
                <Box key={p.id} style={styles.productItem}>
                  <Box
                    width={44}
                    height={44}
                    borderRadius={10}
                    backgroundColor="neutral-100"
                    alignItems="center"
                    justifyContent="center">
                    <AppIcon name="Package" size={20} color="#A5A5A5" />
                  </Box>
                  <Box flex={1} gap={2}>
                    <Typography variant="body-bold" color="secondary-500">
                      {p.name}
                    </Typography>
                    {p.brand ? (
                      <Typography variant="c1" color="neutral-400">
                        {p.brand}
                      </Typography>
                    ) : null}
                    <Typography variant="c1-medium" color="neutral-600">
                      ₦{Number(p.price).toLocaleString()}
                    </Typography>
                  </Box>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleRemoveProduct(p.id)}
                    style={styles.removeBtn}>
                    <AppIcon name="Trash2" size={16} color="#C2C2C2" />
                  </TouchableOpacity>
                </Box>
              ))}
            </Box>
          )}

          {/* CTAs */}
          <Box gap={8} mt={8}>
            <Box flexDirection="row" gap={8}>
              <Box flex={1}>
                <Button
                  variant="outline"
                  label="Back"
                  onPress={handleBack}
                />
              </Box>
              <Box flex={2}>
                <Button
                  hasLinearGradient
                  label={
                    pendingProducts.length > 0
                      ? 'Continue'
                      : 'Continue without products'
                  }
                  loading={isSubmitting}
                  onPress={handleContinue}
                />
              </Box>
            </Box>
            {pendingProducts.length === 0 && (
              <TouchableOpacity activeOpacity={0.7} onPress={handleNext}>
                <Typography
                  variant="c1"
                  color="neutral-400"
                  textAlign="center">
                  Skip — I'll add products from my dashboard
                </Typography>
              </TouchableOpacity>
            )}
          </Box>
        </Box>
      </Container>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  formCard: {
    borderWidth: 1,
    borderColor: '#EDF2F8',
    backgroundColor: '#FFFFFF'
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDF2F8',
    backgroundColor: '#FFFFFF'
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Step2Catalogue
