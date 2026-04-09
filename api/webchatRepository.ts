import {HttpMethods} from '@/libs'
import {UseEndpoint} from '@/utils/api'

export interface StartWebchatPayload {
  name: string
  email: string
  phone_number: string
  business_id: string
}

export default {
  startChat: (payload: StartWebchatPayload) => {
    return UseEndpoint({
      endpoint: '/webchat/start-chat',
      method: HttpMethods.Post,
      payload
    })
  }
}
