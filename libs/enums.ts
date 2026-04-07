export enum HttpMethods {
  Post = 'post',
  Put = 'put',
  Get = 'get',
  Patch = 'patch',
  Delete = 'delete'
}

export interface ApiResponse<T> {
  code: number
  error?: any
  message: string
  data: T
}

export declare class Endpoint<
  ResponseType = unknown,
  BodyType = unknown,
  QueryType = unknown
> {
  path: string
  method: HttpMethods
  fullPath: string
  parentModule?: string
  schemaNames?: {
    body?: string
    response?: string
    query?: string
    endpoint?: {
      name?: string
      prop?: string
    }
  }
  dto?: new () => unknown
  query?: new () => unknown
  name?: string
  tags?: string[]
  description?: string
  responseType: ResponseType
  bodyType: BodyType
  queryType: QueryType
  constructor(ep: Endpoint<ResponseType, BodyType, QueryType>)
}

export enum OtpContext {
  VerifyPhoneNumber = 'verify-phone-number',
  VerifyEmail = 'verify-email',
  ResetPassword = 'reset-password',
  ChangePassword = 'change-password'
}

export enum DashboardFilter {
  today = 'today',
  thisWeek = 'this-week',
  thisMonth = 'this-month',
  allTime = 'all-time'
}

export enum SubscriptionStatus {
  active = 'active',
  cancelled = 'cancelled',
  expired = 'expired',
  paused = 'paused',
  trial = 'trial'
}

export enum ProductStatus {
  inStock = 'inStock',
  lowStock = 'lowStock',
  outOfStock = 'outOfStock'
}
