import {publicClient} from '@/utils/axios'
import {CLOUD_NAME} from '@/utils/cloudinary'

interface CloudinaryResponse {
  asset_id: string
  public_id: string
  url: string
}

export default {
  uploadImageToCloudinary: (payload: FormData): Promise<CloudinaryResponse> => {
    return publicClient.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  },
  uploadFileToCloudinary: (payload: FormData): Promise<CloudinaryResponse> => {
    return publicClient.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  }
}
