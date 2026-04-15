export interface ImageInterface {
  image: string
  isCropped: boolean
  publicId?: string
  assetId?: string
  isUrlImage: boolean
}

export interface PushaFile {
  uri: string
  type: string
  name: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone_number: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  company?: string
  phone?: string
  // Add other profile fields as needed
}

export interface ICloudinaryImage {
  assetId: string
  publicId: string
  url?: string
}

export interface IBase<T = unknown> {
  _id?: string
  _deletedAt?: Date
  createdAt?: Date
  updatedAt?: Date
  customFields?: T
}

export declare enum ProductStatus {
  published = 'published',
  drafted = 'drafted',
  shelved = 'shelved',
  archived = 'archived'
}

export interface IProduct extends IBase {
  store: string
  slug: string
  name: string
  price: number
  discountedPrice?: number
  copiesSold: number
  status: ProductStatus
  images: ICloudinaryImage[]
  collections: string[]
  quantity: number
  description: string
}

export interface VariantObject {
  uuid: string
  name: string
  options: {uuid: string; name: string}[]
}

export interface QuantityObject {
  options: {option: string; variant: string}[]
  quantity: string
  price: string
  uuid: string
}

export enum ProductActions {
  EDIT = 'edit',
  COLLECTION = 'collection',
  INVENTORY = 'inventory',
  PRODUCT_STATUS = 'product-status'
}

export enum CollectionActions {
  EDIT = 'edit',
  DELETE = 'delete'
}

export interface CollectionsProductItemProps {
  product: IProduct
  selectedProducts: string[]
  setItem: (item: string, state: boolean) => void
}

export interface ProductCollectionsItemProps {
  isLast: boolean
  collection: ICollection
  selectedCollections: string[]
  setItem: (item: string, state: boolean) => void
}

export interface ICollection extends IBase {
  store: string | any
  name: string
  slug: string
  products: string[] | IProduct[]
}

export interface ICreateProductPayload {
  images: string[]
  name: string
  description: string
  category_id?: string
  category?: string
  /** Optional; merged into description when calling POST /products */
  brand?: string
  tags: string[]
  unit_price: number
  discount_price: number
  cost_price: number
  visible: boolean
  quantity: number
  low_stock_alert?: number
}

// Payment-related types
export interface ISaleItem {
  product_id: string
  quantity: number
  price: number
}

export interface ICreatePaymentPayload {
  sale_id?: string
  customer_id?: string
  customer_name: string
  amount: number
  method: string
  status: string
  sale_channel: string
  reference: string
  sale_items: ISaleItem[]
}

export interface IPayment extends IBase {
  sale_id: string
  customer_id: string
  customer_name: string
  amount: number
  method: string
  status: string
  sale_channel: string
  reference: string
  sale_items: ISaleItem[]
  confirmed_at?: Date
}

export enum PaymentStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  failed = 'failed',
  cancelled = 'cancelled'
}

export enum PaymentMethod {
  cash = 'cash',
  card = 'card',
  transfer = 'transfer',
  pos = 'pos',
  mobile_money = 'mobile_money'
}

export enum SaleChannel {
  instore = 'INSTORE',
  online = 'ONLINE',
  social_media = 'social_media',
  phone = 'phone'
}

// Sales-related types
export interface ISale extends IBase {
  customer_id?: string
  customer_name?: string
  total_amount: number
  status: string
  sale_channel: SaleChannel
  reference: string
  sale_items: ISaleItem[]
  notes?: string
  discount?: number
  tax?: number
}

// Expenses-related types
export interface ICreateExpensePayload {
  category_id: string
  category?: string
  amount: number
  notes: string
  date: string
}

export interface IExpense extends IBase {
  category_id: string
  category: string
  amount: number
  notes: string
  date: string
}

export interface ICreateExpenseCategoryPayload {
  name: string
  description?: string
}

export interface IExpenseCategory extends IBase {
  name: string
  description: string
  total_expenses?: number
  expense_count?: number
}

// Notification-related types
export interface INotification {
  id: string
  user_id: string
  business_id: string
  title: string
  body: string
  data: Record<string, unknown> | null
  read_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface INotificationPagination {
  total: number
  page: number
  per_page: number
}

export interface INotificationListResponse {
  records: INotification[]
  pagination: INotificationPagination
}
