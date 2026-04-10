import {api} from '@/api'
import {
  AppIcon,
  Box,
  Button,
  Container,
  TextAction,
  TextField,
  Typography
} from '@/components/ui'
import {SegmentedTab} from '@/components/ui/segmented-tab'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {cldOptions} from '@/utils/cloudinary'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'
import {Image} from 'expo-image'
import React, {useState} from 'react'
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import uuid from 'react-native-uuid'
import * as DocumentPicker from 'expo-document-picker'

interface Step2CatalogueProps {
  handleNext: () => void
  handleBack: () => void
}

interface PendingProduct {
  id: string
  name: string
  brand: string
  price: string
  imageUri: string | null
}

const Step2Catalogue = ({handleNext, handleBack}: Step2CatalogueProps) => {
  const [activeTab, setActiveTab] = useState(0)

  const [draftName, setDraftName] = useState('')
  const [draftBrand, setDraftBrand] = useState('')
  const [draftPrice, setDraftPrice] = useState('')
  const [draftImageUri, setDraftImageUri] = useState<string | null>(null)
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csvUploading, setCsvUploading] = useState(false)

  const handleUploadCsv = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/vnd.ms-excel'],
        copyToCacheDirectory: true
      })
      if (result.canceled || !result.assets?.[0]) return
      const asset = result.assets[0]
      setCsvUploading(true)
      const formData = new FormData()
      formData.append('file', {
        uri: asset.uri,
        name: asset.name ?? 'products.csv',
        type: asset.mimeType ?? 'text/csv'
      } as unknown as Blob)
      await api.products.uploadProductFile(formData)
      toast.success('CSV uploaded — your products will be imported.')
    } catch (err) {
      errorHandler(err)
    } finally {
      setCsvUploading(false)
    }
  }

  const handleDownloadTemplate = () => {
    Alert.alert(
      'Product CSV template',
      'Use columns that match your dashboard export, or add products manually for now.'
    )
  }

  const canAddProduct =
    draftName.trim().length > 0 &&
    draftPrice.trim().length > 0 &&
    Number(draftPrice) > 0

  const handlePickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: false,
        compressImageQuality: 0.85,
        mediaType: 'photo'
      })
      setDraftImageUri(image.path)
    } catch {
      // user cancelled — no-op
    }
  }

  const handleRemoveDraftImage = () => {
    setDraftImageUri(null)
  }

  const handleAddProduct = () => {
    if (!canAddProduct) return
    setPendingProducts(prev => [
      ...prev,
      {
        id: uuid.v4() as string,
        name: draftName.trim(),
        brand: draftBrand.trim(),
        price: draftPrice.trim(),
        imageUri: draftImageUri
      }
    ])
    setDraftName('')
    setDraftBrand('')
    setDraftPrice('')
    setDraftImageUri(null)
  }

  const handleRemoveProduct = (id: string) => {
    setPendingProducts(prev => prev.filter(p => p.id !== id))
  }

  const uploadProductImage = async (uri: string): Promise<string> => {
    const formData = await cldOptions(uri, '/onboarding/products')
    const res = await api.public.uploadImageToCloudinary(formData)
    return (
      (res as unknown as {url?: string; secure_url?: string}).secure_url ||
      (res as unknown as {url?: string}).url ||
      ''
    )
  }

  const handleContinue = async () => {
    if (pendingProducts.length === 0) {
      handleNext()
      return
    }
    try {
      setIsSubmitting(true)
      await Promise.all(
        pendingProducts.map(async p => {
          let images: string[] = []
          if (p.imageUri) {
            const url = await uploadProductImage(p.imageUri)
            if (url) images = [url]
          }
          const unitPrice = Number.parseFloat(String(p.price).replace(/,/g, ''))
          return api.products.createProduct({
            name: p.name,
            category: '',
            description: p.brand
              ? `Brand: ${p.brand}\n\nAdded during business setup`
              : 'Added during business setup',
            tags: [],
            images,
            unit_price: unitPrice,
            discount_price: 0,
            cost_price: 0,
            visible: true,
            quantity: 1
          })
        })
      )
      handleNext()
    } catch (err) {
      errorHandler(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const manualEntryPage = (
    <Box gap={12} padding={16}>
      {/* Cover image picker */}
      {draftImageUri ? (
        <View style={styles.imagePreviewWrap}>
          <Image
            source={{uri: draftImageUri}}
            style={styles.imagePreview}
            contentFit="cover"
          />
          <View style={styles.imageOverlay}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.imageAction}
              onPress={handlePickImage}>
              <AppIcon name="RefreshCw" size={14} color="#fff" />
              <Typography variant="c1-medium" style={{color: '#fff'}}>
                Replace
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.imageAction, styles.imageActionDanger]}
              onPress={handleRemoveDraftImage}>
              <AppIcon name="X" size={14} color="#fff" />
              <Typography variant="c1-medium" style={{color: '#fff'}}>
                Remove
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.imagePicker}
          onPress={handlePickImage}>
          <Box
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor="neutral-100"
            alignItems="center"
            justifyContent="center">
            <AppIcon name="Upload" size={20} color="#2554C7" />
          </Box>
          <Typography variant="body-medium" color="neutral-700">
            Browse and select cover image
          </Typography>
          <Typography variant="c1" color="neutral-500">
            PNG, JPG — optional
          </Typography>
        </TouchableOpacity>
      )}

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
  )

  const csvUploadPage = (
    <Box padding={16} gap={16}>
      <Box style={styles.csvDropArea} alignItems="center" gap={16} padding={32}>
        <Box
          width={56}
          height={56}
          borderRadius={12}
          backgroundColor="primary-100"
          alignItems="center"
          justifyContent="center">
          <AppIcon name="FileText" size={28} color="#2554C7" />
        </Box>
        <Box gap={4} alignItems="center">
          <Typography variant="body-bold" color="secondary-500">
            Upload CSV file
          </Typography>
          <Typography
            variant="c1"
            color="neutral-600"
            textAlign="center"
            style={{maxWidth: 260}}>
            Upload a CSV with your product data. Download our template to ensure
            proper formatting.
          </Typography>
        </Box>
        <Box flexDirection="row" gap={8} style={{width: '100%', maxWidth: 280}}>
          <Box flex={1}>
            <Button
              variant="outline"
              label="Template"
              onPress={handleDownloadTemplate}
            />
          </Box>
          <Box flex={1}>
            <Button
              variant="outline"
              label="Upload CSV"
              loading={csvUploading}
              disabled={csvUploading}
              onPress={handleUploadCsv}
            />
          </Box>
        </Box>
      </Box>
      <Typography variant="c1" color="neutral-500" textAlign="center">
        Upload a .csv file to import multiple products at once
      </Typography>
    </Box>
  )

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
            <Typography variant="body" color="neutral-800">
              Add your products so your AI knows exactly what to sell
            </Typography>
          </Box>

          {/* Tab switcher */}
          <Box style={styles.tabCard}>
            <SegmentedTab
              tabs={['Manual Entry', 'CSV Upload']}
              selectedIndex={activeTab}
              onChange={setActiveTab}
              pages={[manualEntryPage, csvUploadPage]}
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
                  {p.imageUri ? (
                    <Image
                      source={{uri: p.imageUri}}
                      style={styles.productThumb}
                      contentFit="cover"
                    />
                  ) : (
                    <Box
                      width={44}
                      height={44}
                      borderRadius={10}
                      backgroundColor="neutral-100"
                      alignItems="center"
                      justifyContent="center">
                      <AppIcon name="Package" size={20} color="#A5A5A5" />
                    </Box>
                  )}
                  <Box flex={1} gap={2}>
                    <Typography variant="body-bold" color="secondary-500">
                      {p.name}
                    </Typography>
                    {p.brand ? (
                      <Typography variant="c1" color="neutral-600">
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
            {/* <Box flexDirection="row" gap={8}>
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
            </Box> */}
            {pendingProducts.length === 0 && (
              <Box justifyContent="center" alignItems="center">
                <TextAction iconName="ArrowRight" onPress={handleNext}>
                  Skip
                </TextAction>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  tabCard: {
    borderWidth: 1,
    borderColor: '#EDF2F8',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden'
  },
  imagePicker: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#EDF2F8',
    borderRadius: 12,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20
  },
  imagePreviewWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 160,
    position: 'relative'
  },
  imagePreview: {
    width: '100%',
    height: '100%'
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  imageAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  imageActionDanger: {
    backgroundColor: '#EF0025'
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
  productThumb: {
    width: 44,
    height: 44,
    borderRadius: 10
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  csvDropArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#EDF2F8',
    borderRadius: 16
  }
})

export default Step2Catalogue
