import {
  AppIcon,
  Avatar,
  Box,
  Button,
  Container,
  PageError,
  PushaActivityIndicator,
  TextField,
  Typography
} from '@/components/ui'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {ScreenView} from '@/components/util/screen-view'
import {useGetUserProfile, useUpdateProfile, useUploadAvatar} from '@/queries/userQuery'
import {toast} from '@/utils/toast'
import {Image} from 'expo-image'
import React, {useCallback} from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import {useFormik} from 'formik'

const Page = () => {
  const {data: user, isLoading, isError, refetch} = useGetUserProfile()
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()

  const u = user as
    | {
        first_name?: string
        last_name?: string
        email?: string
        phone_number?: string
        avatar?: string
        profile_photo?: string
      }
    | undefined

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: u?.first_name ?? '',
      last_name: u?.last_name ?? '',
      email: u?.email ?? '',
      phone_number: u?.phone_number ?? ''
    },
    onSubmit: async values => {
      try {
        await updateProfile.mutateAsync({
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          email: values.email.trim(),
          phone_number: values.phone_number.trim()
        })
        toast.success('Profile updated')
      } catch {
        toast.error('Could not save. Try again.')
      }
    }
  })

  const pickAvatar = useCallback(async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true,
        cropperCircleOverlay: false,
        compressImageQuality: 0.85,
        includeBase64: true,
        mediaType: 'photo'
      })
      const raw = (image as {data?: string}).data
      if (!raw) {
        toast.info('Could not read image. Try another photo.')
        return
      }
      const payload = raw.startsWith('data:')
        ? raw
        : `data:image/jpeg;base64,${raw}`
      await uploadAvatar.mutateAsync({avatar: payload})
      toast.success('Photo updated')
      refetch()
    } catch (e: unknown) {
      const code = (e as {code?: string})?.code
      if (code !== 'E_PICKER_CANCELLED') {
        toast.error('Upload failed. Try again.')
      }
    }
  }, [uploadAvatar, refetch])

  if (isError) {
    return <PageError reload={() => refetch().then(() => {})} />
  }

  const photoUri = u?.avatar || u?.profile_photo

  return (
    <ScreenView navTitle="Account Information" alignNav="center" hasTopBanner={false}>
      {isLoading && !u ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <KeyboardAwareScrollView>
          <Container>
            <Box mt={20} alignItems="center" mb={24}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={pickAvatar}
                accessibilityLabel="Change profile photo">
                <View style={styles.avatarWrap}>
                  {photoUri ? (
                    <Image
                      source={{uri: photoUri}}
                      style={styles.avatarImg}
                      contentFit="cover"
                    />
                  ) : (
                    <Avatar
                      src={undefined}
                      name={`${formik.values.first_name} ${formik.values.last_name}`}
                      size={96}
                    />
                  )}
                  <Box style={styles.uploadBadge}>
                    <AppIcon name="Upload" size={16} color="#142952" />
                  </Box>
                </View>
              </TouchableOpacity>
              <Typography variant="c2" color="neutral-600" mt={10}>
                Tap to update photo
              </Typography>
            </Box>

            <TextField
              name="first_name"
              label="First name"
              value={formik.values.first_name}
              onChangeText={formik.handleChange('first_name')}
              marginBottom={16}
            />
            <TextField
              name="last_name"
              label="Last name"
              value={formik.values.last_name}
              onChangeText={formik.handleChange('last_name')}
              marginBottom={16}
            />
            <TextField
              name="email"
              label="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              marginBottom={16}
            />
            <TextField
              name="phone_number"
              label="Phone number"
              keyboardType="phone-pad"
              value={formik.values.phone_number}
              onChangeText={formik.handleChange('phone_number')}
              marginBottom={24}
            />

            <Button
              label="Save"
              loading={updateProfile.isPending}
              disabled={updateProfile.isPending}
              onPress={() => formik.handleSubmit()}
            />
          </Container>
        </KeyboardAwareScrollView>
      )}
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative'
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 12
  },
  uploadBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9EAEB'
  }
})

export default Page
