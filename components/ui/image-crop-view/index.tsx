import * as FileSystem from 'expo-file-system'
import {Image} from 'expo-image'
import {uniqueId} from 'lodash'
import React, {useEffect, useState} from 'react'
import {Alert} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'

import AppIcon from '../app-icon'
import Box from '../box'
import Button from '../button'
import Container from '../container'
import AppPressable from '../pressable'
import Typography from '../typography'

import {ImageInterface} from '@/types'

const imagePlaceholder = require('../../../assets/image-placeholder.png')

interface ImageCropViewProps {
  images: ImageInterface[]
  onCropImages: (images: ImageInterface[]) => void
  onClose: () => void
}

export const ImageCropView = (props: ImageCropViewProps) => {
  const {images, onCropImages, onClose} = props
  const [selectedImages, setSelectedImages] = useState<ImageInterface[]>([])
  const [currentImage, setCurrentImage] = useState<ImageInterface>()
  const [showErrors, setShowErrors] = useState(false)
  const [hostedImages, setHostedImages] = useState<ImageInterface[]>([])

  useEffect(() => {
    if (!images.length) {
      onClose()
      return
    }

    const localImages = images.filter(img => !img.image.includes('https://'))

    setHostedImages(images.filter(img => img.image.includes('https://')))
    setSelectedImages(localImages)

    setCurrentImage(localImages[0])
  }, [images])

  const imgDir = FileSystem.documentDirectory + 'product-images/'

  const handleImageCrop = async () => {
    try {
      const croppedImage = await ImagePicker.openCropper({
        // @ts-ignore
        path: currentImage?.image,
        cropperChooseText: 'crop',
        width: 700,
        height: 700
      })

      const fileName = croppedImage?.path.split('/').pop() ?? ''
      const newUri = imgDir + fileName

      await FileSystem.copyAsync({
        from: croppedImage.path,
        to: newUri
      })

      const imagesCopy: ImageInterface[] = JSON.parse(
        JSON.stringify(selectedImages)
      )
      const idx = imagesCopy.findIndex(
        (img: {image: string | undefined}) => img.image === currentImage?.image
      )

      imagesCopy[idx] = {...imagesCopy[idx], image: newUri, isCropped: true}
      setSelectedImages(imagesCopy)

      const imgInfo = await FileSystem.getInfoAsync(currentImage?.image ?? '')
      if (imgInfo.exists) {
        await FileSystem.deleteAsync(currentImage?.image ?? '')
      }

      setCurrentImage({isUrlImage: false, image: newUri, isCropped: true})
    } catch (err) {
      console.log(err)
    }
  }

  const handleSave = async () => {
    const areAllCropped = selectedImages.every(img => img.isCropped)
    if (!areAllCropped) {
      setShowErrors(true)
      Alert.alert('', 'For best results, please crop all images to a 1:1 ratio')
      return
    }
    onCropImages([...hostedImages, ...selectedImages])
  }

  const deleteImageFromStorage = async (img: ImageInterface) => {
    const imgInfo = await FileSystem.getInfoAsync(img.image)
    if (imgInfo.exists) {
      await FileSystem.deleteAsync(img.image, {idempotent: true})
    }
  }

  const handleClose = () => {
    Alert.alert(
      'Discard images?',
      'This action will discard your current image selections',
      [
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => {}
        },
        {
          text: 'Discard',
          onPress: () => {
            onClose()
          }
          // style: 'destructive'
        }
      ]
    )
  }

  return (
    <Box
      backgroundColor="black"
      position="absolute"
      style={{
        backgroundColor: 'black',
        zIndex: 1000,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }}>
      <Box flex={1}>
        <Container>
          <Box flexDirection="row" justifyContent="space-between">
            <AppPressable
              onPress={handleClose}
              height={40}
              width={40}
              backgroundColor="#777777b8"
              alignItems="center"
              justifyContent="center"
              borderRadius={20}>
              <AppIcon name="close" size={24} color="white" />
            </AppPressable>

            <AppPressable
              onPress={handleImageCrop}
              height={40}
              width={40}
              backgroundColor="#777777b8"
              alignItems="center"
              justifyContent="center"
              borderRadius={20}>
              <AppIcon name="crop_rotate" size={24} color="white" />
            </AppPressable>
          </Box>

          <Box justifyContent="center" alignItems="center" mt={32}>
            <Box width={350}>
              <Typography color="white" textAlign="right" variant="c1" mb={20}>
                Please crop all images to a {'\n'} 1:1 ratio for best results
              </Typography>
            </Box>
            <Image
              placeholder={imagePlaceholder}
              placeholderContentFit="cover"
              source={{uri: currentImage?.image}}
              style={{width: 350, height: 350}}
              accessibilityIgnoresInvertColors
            />
          </Box>

          <Box mt={20} alignItems="center">
            <Box flexDirection="row" gap={12} width={350}>
              {selectedImages.map(img => {
                return (
                  <ImagePickerItem
                    showErrors={showErrors}
                    key={uniqueId()}
                    img={img}
                    onSelect={setCurrentImage}
                    isSelected={currentImage?.image === img.image}
                    onDelete={() => {
                      setSelectedImages(imgs => {
                        return imgs.filter(e => e.image !== img.image)
                      })

                      // Remove image from file system to avoid space build up
                      deleteImageFromStorage(img)
                    }}
                  />
                )
              })}
            </Box>
          </Box>
        </Container>
      </Box>
      <Box mt={20}>
        <Container>
          <Button label="Save images" onPress={handleSave} />
        </Container>
      </Box>
    </Box>
  )
}

interface ImagePickerItemProps {
  img: ImageInterface
  showErrors: boolean
  onSelect: (img: ImageInterface) => void
  isSelected: boolean
  onDelete: (img: string) => void
}

const ImagePickerItem = (props: ImagePickerItemProps) => {
  return (
    <AppPressable onPress={() => props.onSelect(props.img)}>
      <Box
        borderRadius={4}
        position="relative"
        style={{
          borderWidth: 2,
          borderColor: props.isSelected ? '#ffffff' : 'transparent'
        }}>
        <Image
          placeholder={imagePlaceholder}
          placeholderContentFit="cover"
          source={{uri: props.img.image}}
          style={{width: 48, height: 48, borderRadius: 4}}
          accessibilityIgnoresInvertColors
        />
        {props.isSelected && (
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#00000040'
            }}>
            <AppPressable
              flex={1}
              alignItems="center"
              justifyContent="center"
              onPress={() => props.onDelete(props.img.image)}>
              <AppIcon name="delete-2" size={24} color="white" />
            </AppPressable>
          </Box>
        )}
        {props.showErrors && !props.img.isCropped && (
          <Box
            style={{
              position: 'absolute',
              right: -5,
              bottom: -5,
              borderRadius: 10,
              backgroundColor: '#ffffff'
            }}>
            <AppIcon color="red" size={16} name="info-fill" />
          </Box>
        )}
      </Box>
    </AppPressable>
  )
}
