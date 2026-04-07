import {Cloudinary} from '@cloudinary/url-gen'
import * as FileSystem from 'expo-file-system'

import ENV from '@/env'
import {PushaFile} from '@/types'
import {getFileExtFromUri} from '.'

export const CLOUD_NAME = ENV.CLOUDINARY_NAME as string

export const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUD_NAME
  },
  url: {
    secure: true
  }
})

export const cldOptions = async (uri: string, folderName: string) => {
  const formData = new FormData()
  const fileContent = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64
  })

  const base64file = `data:image/${getFileExtFromUri(
    uri
  )};base64,${fileContent}`

  formData.append('file', base64file)
  formData.append('upload_preset', 'pusha-merchant')
  formData.append('cloud_name', CLOUD_NAME)
  formData.append('folder', `merchants${folderName}`)

  return formData
}

interface FileMeta {
  merchant: string
  store: string
  file: PushaFile
  folderName: string
}

export const cldFileOptions = async ({
  file,
  folderName,
  merchant,
  store
}: FileMeta) => {
  const formData = new FormData()
  const fileContent = await FileSystem.readAsStringAsync(file.uri, {
    encoding: FileSystem.EncodingType.Base64
  })

  const base64file = `data:${file.type};base64,${fileContent}`
  const timestamp = Date.now()

  formData.append('file', base64file)
  formData.append('upload_preset', 'pusha-files')
  formData.append('cloud_name', CLOUD_NAME)
  formData.append('folder', `${folderName}`)
  formData.append(
    'public_id',
    'm-' +
      merchant +
      '_' +
      's-' +
      store +
      '_' +
      't-' +
      timestamp +
      '.' +
      getFileExtFromUri(file.uri)
  )

  return formData
}
