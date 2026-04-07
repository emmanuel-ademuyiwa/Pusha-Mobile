# Pusha – Codebase Reference

> **Read this file before every implementation.** It is the single source of truth for architecture decisions, conventions, patterns, and gotchas in this codebase.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Routing & Navigation](#4-routing--navigation)
5. [Authentication Flow](#5-authentication-flow)
6. [State Management](#6-state-management)
7. [API & Service Layer](#7-api--service-layer)
8. [Data Models & Types](#8-data-models--types)
9. [Theme & Styling](#9-theme--styling)
10. [UI Component Library](#10-ui-component-library)
11. [Modals](#11-modals)
12. [Screens](#12-screens)
13. [Hooks](#13-hooks)
14. [Queries (TanStack Query)](#14-queries-tanstack-query)
15. [Zustand Stores](#15-zustand-stores)
16. [Utilities](#16-utilities)
17. [Storage (MMKV)](#17-storage-mmkv)
18. [Known Issues & Gotchas](#18-known-issues--gotchas)
19. [Conventions & Patterns](#19-conventions--patterns)

---

## 1. Project Overview

**Pusha** is a React Native / Expo mobile application for merchants. It allows merchants to:

- Manage products, inventory, and collections
- Record and track sales, expenses, and payments
- Manage customers
- Monitor business analytics/dashboard
- Handle subscriptions, wallet, and referrals
- Chat with customers
- Connect social media accounts
- Set up and manage their business profile

**Platform:** iOS + Android (Expo managed/prebuild, `eas.json` has dev/preview/production profiles)

**Package manager:** `pnpm`

---

## 2. Tech Stack

| Layer | Library | Version |
|-------|---------|---------|
| Runtime | React 19, React Native 0.79 | `~0.79` |
| Framework | Expo | `~53` |
| Navigation | expo-router (file-based) + @react-navigation/native | `~5` |
| Styling | @shopify/restyle (ThemeProvider) | — |
| Server state | @tanstack/react-query + persist | — |
| HTTP | axios | — |
| Local storage | react-native-mmkv | — |
| Async storage | @react-native-async-storage/async-storage | — |
| Global client state | zustand | — |
| Forms | formik + yup | — |
| Bottom sheets | @gorhom/bottom-sheet | — |
| Animations | react-native-reanimated, react-native-gesture-handler | — |
| Keyboard | react-native-keyboard-controller | — |
| Images | expo-image, expo-image-picker, image-crop-picker | — |
| Image CDN | @cloudinary/url-gen | — |
| Charts | react-native-gifted-charts | — |
| Toasts | react-native-toast-notifications (`global.toast`) | — |
| Auth | expo-local-authentication (biometrics) | — |
| Payments | react-native-paystack-webview | — |
| Error monitoring | @sentry/react-native (production only) | — |
| OTA updates | expo-updates | — |
| Language | TypeScript ~5.8 | — |

**Note:** `@reduxjs/toolkit` and `redux` are in `package.json` but **not used** — state is **Zustand + TanStack Query** only.

---

## 3. Directory Structure

```
pusha/
├── app/                     # Expo Router file-based routes
│   ├── _layout.tsx          # Root layout (providers, fonts, Sentry)
│   ├── index.tsx            # Entry – splash + authenticate()
│   ├── +not-found.tsx
│   ├── (public)/            # Unauthenticated routes (no URL prefix)
│   │   ├── _layout.tsx      # Stack, initialRouteName: "login"
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── login-or-register.tsx
│   │   ├── fresh-login.tsx
│   │   ├── forgot-password.tsx
│   │   ├── reset-password-otp.tsx
│   │   └── reset-password.tsx
│   └── (auth)/              # Authenticated routes (no URL prefix)
│       ├── _layout.tsx      # Stack + OTA overlay
│       ├── setup-business.tsx
│       ├── notifications.tsx
│       ├── webview-modal.tsx
│       └── (tabs)/          # Bottom tab navigator
│           ├── _layout.tsx  # Custom tab bar (TabBarButton)
│           ├── dashboard.tsx
│           ├── sales.tsx
│           ├── products.tsx
│           ├── chats.tsx
│           ├── more.tsx
│           └── customers.tsx  # href: null (hidden from tab bar)
│
├── api/                     # API repository modules
│   ├── index.ts             # Exports `api` object
│   ├── authRepository.ts
│   ├── userRepository.ts
│   ├── merchantsRespository.ts
│   ├── productsRepository.ts
│   ├── salesRepository.ts
│   ├── customersRepository.ts
│   ├── expensesRepository.ts
│   ├── paymentsRepository.ts
│   ├── subscriptionRepository.ts
│   ├── walletRepository.ts
│   ├── bankAccountRepository.ts
│   ├── earningsRepository.ts
│   ├── referralsRepository.ts
│   ├── notificationsRepository.ts
│   ├── chatsRepository.ts
│   ├── socialsRepository.ts
│   ├── communicationsRepository.ts
│   ├── publicRepository.ts
│   └── [orphans: analyticsRepository, ordersRepository,
│       settlementsRepository, storesRepository,
│       transactionsRepository — not in api/index.ts]
│
├── components/
│   ├── ui/                  # Design system primitives (see §10)
│   ├── modals/              # 42 bottom-sheet / modal screens (see §11)
│   ├── screens/             # Screen-level building blocks (see §12)
│   ├── shared/              # Cross-screen shared components
│   ├── svgs/                # SVG illustrations as TSX
│   └── util/                # Keyboard-aware wrappers, screen-view
│
├── constants/
│   ├── ApiConstants.ts      # BASE_URL, REQUEST_TIMEOUT_MS, status enums
│   ├── Colors.ts            # Expo template colors (legacy)
│   └── queryKeys.ts         # TanStack Query key constants
│
├── hooks/                   # Custom React hooks (see §13)
├── libs/
│   └── enums.ts             # HttpMethods, ApiResponse<T>, OtpContext,
│                            # DashboardFilter, SubscriptionStatus, ProductStatus
├── queries/                 # TanStack Query hooks (see §14)
├── services/
│   ├── authService.ts       # Token refresh logic
│   └── appService.ts
├── store/                   # Zustand stores (see §15)
├── theme/                   # Shopify Restyle theme
│   ├── index.ts             # palette, createTheme, Theme type
│   ├── text.ts              # textVariants
│   ├── button.ts            # buttonVariants
│   └── spacing.ts           # spacing (–1000 to 1000 numeric map)
├── types/
│   ├── index.ts             # Shared domain interfaces & enums
│   ├── modal.ts             # Re-exports @gorhom/bottom-sheet
│   └── queries-mutations.ts # QueryKeys enum (mostly superseded)
├── utils/                   # Shared utilities (see §16)
├── assets/                  # Fonts, images, Lottie JSON
├── plugins/                 # Custom Expo config plugins (Android)
└── env.ts                   # ⚠️ gitignored — provides BASE_URL, CLOUDINARY_NAME
```

---

## 4. Routing & Navigation

### Architecture

- **File-based routing** via `expo-router ~5`
- Route groups `(public)` and `(auth)` are filesystem-only and do not appear in URLs
- Root `_layout.tsx` renders a `<Stack>` with `animation: 'fade'`
- **Providers wrapped in root layout (order matters):**

```
PaystackProvider
  PersistQueryClientProvider
    GestureHandlerRootView
      ToastProvider
        ThemeProvider
          KeyboardProvider
            ModalProvider
              SafeAreaProvider
                Stack
```

### Tab Bar

- Active color: `#2554C7`
- Inactive color: `#777777`
- Border: `#E9EAEB`
- Tabs: Dashboard | Sales | Products | Chats | More
- Customers tab has `href: null` (accessible programmatically, hidden from tab bar)

### Auth-Stack Extra Screens (registered in `(auth)/_layout.tsx`)

`products/edit/[productId]`, `create-product`, `product-variants`, `unlisted-products`, `webview-modal`, and all `(more)/*` routes.

### More-Stack Routes

`/account-information`, `/add-bank-account`, `/bank-details`, `/business-information`, `/business-intelligence`, `/change-passcode`, `/connect-socials`, `/expenses`, `/expenses/[expensesId]`, `/(more)/products`, `/referral-earnings`, `/subscriptions`, `/support`, `/transactions`, `/wallet`

### Dynamic Routes

- `/products/[productId]`
- `/customers/[customerId]`
- `/chat/[chatId]`

### Navigation Imperative API

Always use `expo-router`'s `router` object:

```typescript
import {router} from 'expo-router'

router.replace('/dashboard')
router.navigate('/some-route')
router.dismissTo('/dashboard')
router.back()
```

---

## 5. Authentication Flow

### Initialization (`app/index.tsx`)

1. Waits for TanStack cache to restore (`useIsRestoring()`)
2. Hides splash after delay
3. Calls `authActions.authenticate()`

### `authenticate()` Decision Tree

```
Has user in MMKV + has authority?
├── YES: Has is_active?
│   ├── NO  → navigate /signup?email=...
│   ├── YES + has accessToken → router.dismissTo('/dashboard')
│   └── YES + no token → clearSession()
└── NO → switchUser() → resetAppStorage() → router.replace('/login-or-register')
```

### Login (`logIn`)

1. POST to `/auth/login` with `{ email_or_phone, password }`
2. Save `accessToken`, `user`, `authority` to MMKV vault
3. If `user.business && user.business_id` → `routeUser()`
4. Else → `router.dismissTo('/(auth)/setup-business')`
5. Unverified account error → `router.navigate('/signup?verifyEmail=true&email=...')`

### `routeUser()`

1. Calls `userQuery()` (React Query fetch of `/user`)
2. Saves user to MMKV vault
3. `router.replace('/dashboard')`

### Logout

`clearSession()` — deletes `accessToken`, `refreshToken`, `resetToken` from MMKV, routes to `/login`

### Token Refresh (axios interceptor)

- On 401: `authService.refreshToken()` → retry original request
- If refresh fails: `clearSession('expired')` → toast "Your session has expired!" → `/login`
- Queued requests handled with subscriber pattern (prevents multiple simultaneous refreshes)

### MMKV Vault Keys

| Key | Value |
|-----|-------|
| `accessToken` | Bearer token |
| `refreshToken` | Refresh token |
| `resetToken` | Password reset token |
| `authority` | User's password (used to verify local session) |
| `user` | Serialized user object |
| `biometricsEnabled` | boolean |
| `hasAppLaunchedBefore` | boolean |
| `pushToken` | Push notification token |
| `deviceRegistered` | boolean |
| `showTrialModal` | boolean |
| `otaLastChecked` | timestamp |

---

## 6. State Management

### Three-layer approach

| Layer | Tool | Used For |
|-------|------|----------|
| Server/async | TanStack Query | All API data — cached, persisted to AsyncStorage |
| Global client | Zustand | Auth state, UI state, in-flight form data |
| Local persistent | MMKV | Tokens, user object, flags |

### Do NOT use

- Redux / RTK (in deps but not used)
- React Context for app data

---

## 7. API & Service Layer

### Axios Clients

Three clients defined in `utils/axios.ts`:

| Client | Export | Auth | Used For |
|--------|--------|------|----------|
| `apiClient` | named | Bearer token from MMKV | All authenticated requests |
| `publicClient` | named | None | Public endpoints (login, signup, etc.) |
| `resetAccountClient` | named | `resetToken` from MMKV | Password reset flow |

### `UseEndpoint` (`utils/api.ts`)

Central dispatcher. Selects the correct axios client based on `clientType`.

```typescript
UseEndpoint({
  clientType: 'public' | 'auth' | 'reset',
  endpoint: string,
  method: HttpMethods,
  payload?: object,
  query?: object,
  headers?: object
})
```

### API Object (`api/index.ts`)

```typescript
import {api} from '@/api'

api.auth          // AuthRepository
api.user          // UserRepository
api.merchants     // MerchantsRepository
api.products      // productsRepository
api.sales         // SalesRepository
api.customers     // CustomersRepository
api.expenses      // ExpensesRepository
api.payments      // PaymentsRepository
api.subscription  // SubscriptionRepository
api.wallet        // WalletRepository
api.bankAccount   // BankAccountRepository
api.earnings      // EarningsRepository
api.referrals     // ReferralsRepository
api.notifications // NotificationsRepository
api.chats         // ChatsRepository
api.socials       // SocialsRepository
api.communications // CommunicationsRepository
api.public        // publicRepository
```

### Response Shape

```typescript
interface ApiResponse<T> {
  code: number
  error?: any
  message: string
  data: T
}
```

### Base URL

Comes from `env.ts` (gitignored) via `constants/ApiConstants.ts`:
```typescript
import ENV from '../env'
export const BASE_URL = ENV.BASE_URL as string
export const DEV_BASE_URL = ENV.DEV_BASE_URL as string
export const REQUEST_TIMEOUT_MS = 15000
```

The `app.json` `extra.ENV` field also contains `BASE_URL` and `CLOUDINARY_NAME` as a fallback.

### OTP Contexts (`libs/enums.ts`)

```typescript
enum OtpContext {
  VerifyPhoneNumber = 'verify-phone-number',
  VerifyEmail       = 'verify-email',
  ResetPassword     = 'reset-password',
  ChangePassword    = 'change-password'
}
```

---

## 8. Data Models & Types

### Location

- **`types/index.ts`** — shared domain interfaces
- **`libs/enums.ts`** — shared enums
- Repository files may define local interfaces for their own payloads

### Core Types (`types/index.ts`)

```typescript
// Images
ImageInterface    // { image, isCropped, publicId?, assetId?, isUrlImage }
PushaFile         // { uri, type, name }
ICloudinaryImage  // { assetId, publicId, url? }

// Users
RegisterData      // { email, password, first_name, last_name, phone_number }
UserProfile       // { id, email, name, company?, phone? }

// Base
IBase<T>          // { _id?, _deletedAt?, createdAt?, updatedAt?, customFields? }

// Products
IProduct          // extends IBase; name, price, status, images[], quantity, etc.
ICollection       // extends IBase; name, slug, products[]
ICreateProductPayload
VariantObject, QuantityObject

// Sales & Payments
ISale, ISaleItem, IPayment, ICreatePaymentPayload
PaymentStatus     // pending | confirmed | failed | cancelled
PaymentMethod     // cash | card | transfer | pos | mobile_money
SaleChannel       // INSTORE | ONLINE | social_media | phone

// Expenses
IExpense, ICreateExpensePayload
IExpenseCategory, ICreateExpenseCategoryPayload

// Enums
ProductStatus (types)  // published | drafted | shelved | archived
ProductActions         // edit | collection | inventory | product-status
CollectionActions      // edit | delete
```

### Core Enums (`libs/enums.ts`)

```typescript
HttpMethods          // post | put | get | patch | delete
OtpContext           // verify-phone-number | verify-email | reset-password | change-password
DashboardFilter      // today | this-week | this-month | all-time
SubscriptionStatus   // active | cancelled | expired | paused | trial
ProductStatus (libs) // inStock | lowStock | outOfStock
```

---

## 9. Theme & Styling

### Shopify Restyle

All components should use Restyle primitives (`Box`, `Text` via `Typography`, etc.) for consistent theming. The `ThemeProvider` is in the root layout.

### Palette (Key Colors)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-100` | `#2554cf` | Main CTA, buttons |
| `primary-300` | `#2554C7` | Active tab, links |
| `primary-400` | `#1D419B` | Hover/pressed states |
| `primary-disabled` | `#a3b8f0` | Disabled primary |
| `secondary-100` | `#142952` | Dark brand color |
| `light-primary` | `#EFF4FF` | Light backgrounds |
| `success-100` | `#20B038` | Success states |
| `error-100` | `#D70015` | Error states |
| `error-200` | `#FF3B30` | Error text |
| `caution-100` | `#F0960F` | Warning states |
| `stroke` | `#E9EAEB` | Dividers, borders |
| `text-primary` | `#454A53` | Body text |
| `text-tertiary` | `#757575` | Secondary text |
| `neutral-700` | `#777777` | Inactive states |

### Spacing

`theme/spacing.ts` generates a numeric spacing map from -1000 to 1000. Use whole numbers: `<Box margin={16} padding={8} />`.

### Fonts

| Font Name | Weight | File |
|-----------|--------|------|
| `InstrumentSan-Regular` | 400 | InstrumentSan-Regular.ttf |
| `InstrumentSan-Medium` | 500 | InstrumentSan-Medium.ttf |
| `InstrumentSan-SemiBold` | 600 | InstrumentSan-SemiBold.ttf |
| `InstrumentSan-Bold` | 700 | InstrumentSan-Bold.ttf |
| `Dahlia-Bold` | bold | dahlia-bold.otf |
| `Dahlia-Medium` | medium | dahlia-medium.otf |
| `icomoon` | — | icomoon.ttf (icon font) |

### Import Pattern

```typescript
import {theme} from '@/theme'
import type {Theme, ThemeColors} from '@/theme'
```

---

## 10. UI Component Library

All primitives are exported from `components/ui/index.ts`. Import with `@/components/ui`.

| Component | Notes |
|-----------|-------|
| `Box` | Restyle-aware View |
| `Typography` | Text with variants |
| `Button` | Primary/secondary/ghost variants |
| `TextField` | Controlled input with label |
| `TextArea` | Multi-line text input |
| `PhoneField` | Phone number input with country picker |
| `OtpInput` | OTP code entry |
| `AppModal` (= `EUModal`) | Bottom-sheet modal wrapper |
| `BackButton` | Navigates back |
| `Tabs` | Tab switcher |
| `TabSlider` | Sliding tab indicator |
| `Banner` | Info/warning banner |
| `EmptyState` | Empty list state |
| `SearchField` / `SearchableInput` | Search inputs |
| `SelectField` | Dropdown selector |
| `MultiSelectField` | Multi-select |
| `GroupSelect` | Grouped selection |
| `Checkbox` | Checkbox input |
| `Switch` | Toggle switch |
| `DatePicker` | Date selection |
| `PeriodFilter` | Dashboard period selector |
| `SpinnerOverlay` | Loading overlay |
| `PageError` | Error state |
| `DisplayState` | Loading/empty/error/data state switcher |
| `Avatar` | User/product avatar |
| `Badge` | Status badge |
| `Divider` | Horizontal line |
| `Pressable` | Touchable with feedback |
| `ImageCropView` | Cropped image display |
| `Container` | Screen container |
| `AppView` | Base app view |
| `ActivityIndicator` | Spinner |
| `ThreeDotsLoader` | Animated dots loader |
| `BlinkingCursor` | Blinking cursor animation |
| `ServiceBanner` | Service status banner |
| `TextAction` | Tappable text link |
| `RefreshControl` | Pull-to-refresh |
| `AppIcon` | App icon display |
| `TabBarButton` | Custom tab bar button |

### Util Wrappers (`components/util/`)

- `KeyboardAwareScrollView` — scroll view that avoids keyboard
- `ModalKeyboardAwareScrollView` — keyboard-aware inside modals
- `ScreenView` — standard screen container

---

## 11. Modals

Located in `components/modals/`. All are bottom-sheet based via `@gorhom/bottom-sheet` (exported as `Modal`, `ModalProvider` from `types/modal.ts`).

### Product / Inventory

- `add-or-edit-product.tsx` — Full product create/edit form (Formik)
- `add-or-edit-customer.tsx` — Customer create/edit
- `create-product-collection.tsx` — Create a collection
- `product-variants.tsx` — Manage product variants
- `inventory.tsx` — Adjust stock
- `product-selector-modal.tsx` — Pick products
- `color-picker.tsx` — Color selection

### Sales & Payments

- `add-or-edit-sale.tsx` — Create/edit a sale
- `payment-link.tsx` — Generate payment link
- `order-settlement-info.tsx` — Settlement details
- `pending-order-settlement-info.tsx` — Pending settlement
- `update-order-payment-status.tsx` — Update payment status

### Expenses

- `add-or-edit-expenses.tsx` — Create/edit expense
- `add-or-edit-expense-category.tsx` — Create/edit category

### Subscriptions

- `cancel-subscription.tsx`
- `cancel-subscription-confirm.tsx`
- `welcome-trial.tsx`

### Auth / Account

- `signup-otp-verification.tsx` — Email OTP during signup
- `change-password-otp.tsx` — OTP for password change
- `business-account-info.tsx` — Business profile info
- `business-setup-success.tsx` — Post-setup success screen

### Legal

- `tos.tsx` — Terms of service
- `privacy-policy.tsx` — Privacy policy

---

## 12. Screens

Located in `components/screens/`. These are building blocks composed within route files.

### Business Setup

- `business-setup/step1-details.tsx` — Business details form
- `business-setup/step2-*.tsx` ... `step4-preview.tsx`
- `business-setup/business-details.tsx`

### Dashboard

- `screens/dashboard/` — Stats, charts, period filter, overview

### More

- `screens/more/wallet/` — Wallet views
- `screens/more/subscriptions/` — Subscription management tabs

### Products

- `screens/products/product.tsx` — Single product view

### Sales

- `screens/sales/` — Sales list and detail

### Onboarding

- `screens/onboarding/` — Onboarding slides

### OTA / Splash

- `screens/ota/` — OTA update overlay
- `screens/splash/` — Splash screen

---

## 13. Hooks

Located in `hooks/`. Import with `@/hooks/...`.

| Hook | File | Purpose |
|------|------|---------|
| `useInfinitePagination` | `useInfinitePagination.ts` | Wraps `useInfiniteQuery` for `{ records: [] }` APIs |
| `usePushNotifications` | `usePushNotifications.ts` | Register + get push token |
| `useMediaPermissions` | `useMediaPersmissions.ts` | Request media library permissions (note typo in filename) |
| `useForwardedRef` | `useForwardedRef.ts` | Ref forwarding utility |
| `useThemeColor` | `useThemeColor.ts` | Access theme colors |
| `useColorScheme` | `useColorScheme.ts` | Light/dark mode |
| `useModalBackHandler` | `useModalBackHandler.ts` | Android back button in modals |
| `useRefresh` | `useRefresh.ts` | Pull-to-refresh with network check |
| `useCountdownTimer` | `useCountdownTimer.ts` | Countdown for OTP timers |

### Infinite Pagination Pattern

For list endpoints that return `{ records: [...], total, page, limit }`:

```typescript
const {data, fetchNextPage, hasNextPage} = useInfinitePagination({
  queryKey: ['products'],
  fetchFn: (page) => api.products.getAll({ page })
})
```

---

## 14. Queries (TanStack Query)

Located in `queries/`. Each file exports typed query hooks and/or standalone query functions.

| File | Domain |
|------|--------|
| `userQueries.ts` | User profile (`userQuery()` standalone fn) |
| `userQuery.ts` | User query hooks |
| `productsQuery.ts` | Products list, single product |
| `customersQuery.ts` | Customers list, single customer |
| `salesQuery.ts` | Sales list, single sale |
| `expensesQuery.ts` | Expenses list, categories |
| `paymentsQuery.ts` | Payments |
| `analyticsQuery.ts` | Dashboard analytics |
| `chatsQuery.ts` | Chat list, messages |
| `notificationsQuery.ts` | Notifications |
| `subscriptionQuery.ts` | Subscription status/plans |
| `walletQuery.ts` | Wallet balance/transactions |
| `earningsQuery.ts` | Earnings data |
| `bankAccountQuery.ts` | Linked bank accounts |
| `referralsQuery.ts` | Referral data |
| `socialsQuery.ts` | Social media connections |

### Query Client (`utils/queryClient.ts`)

```typescript
import {queryClient, clientPersister} from '@/utils/queryClient'
```

- Cache persisted to `AsyncStorage`
- `maxAge: Infinity`
- Global query error handler in `utils/errorHandler.ts`
- `queryClient.clear()` is called on logout/session reset

### Query Keys (`constants/queryKeys.ts`)

Always use defined query key constants, do not hardcode strings.

---

## 15. Zustand Stores

Located in `store/`. Each store follows: `create<StoreType>()((set, get) => ({...}))`.

### Pattern for accessing stores

```typescript
// Selectors are exported as named hooks
const { logIn, logout } = useAuthActions()
const loadingState = useAuthLoadingState()
```

### Store Inventory

| File | Selectors Exported | Purpose |
|------|--------------------|---------|
| `authStore.ts` | `useAuthActions`, `useAuthLoadingState`, `useBiometricsEnabled`, `useDeleteAccountPayload` | Auth flow |
| `merchantStore.ts` | — | Merchant/business setup |
| `productsStore.ts` | — | Products list state |
| `productStore.ts` | — | Single product state |
| `salesStore.ts` | — | Sales state |
| `expensesStore.ts` | — | Expenses state |
| `paymentsStore.ts` | — | Payments state |
| `socialsStore.ts` | — | Social accounts state |
| `appStore.ts` | — | Global UI (snackbar, etc.) |
| `updatesStore.ts` | — | OTA update UI state |
| `pushNotificationStore.ts` | — | Push notification state |

### ⚠️ Missing Store

`@/store/storeStore` is **imported** in multiple modals (`useStoreId`, `useSubdomain`) but the file **does not exist** in the repo. Before implementing anything that needs store/subdomain data, verify this file's status.

---

## 16. Utilities

Located in `utils/`. Import with `@/utils/...`.

| Module | Key Exports | Purpose |
|--------|-------------|---------|
| `axios.ts` | `apiClient`, `publicClient`, `resetAccountClient` | Axios instances + interceptors |
| `api.ts` | `UseEndpoint` | Request dispatcher |
| `call-api.function.ts` | `callApi` | Alternative generic request helper |
| `storage.ts` | `saveToVault`, `getFromVault`, `deleteFromVault`, `valueExistsInVault`, `clearSession`, `resetAppStorage`, `zustandStorage` | MMKV access |
| `queryClient.ts` | `queryClient`, `clientPersister` | React Query client + persister |
| `errorHandler.ts` | `errorHandler` | User-facing error display |
| `toast.ts` | `toast` (default) | Toast helper (`toast.info()`, `toast.error()`, `toast.success()`) |
| `network.ts` | `getNetworkStatus` | Network reachability check |
| `datetime.ts` | — | Date formatting helpers |
| `currency.ts` | — | Currency formatting |
| `formatters.ts` | — | General formatters |
| `fields.ts` | — | Form field helpers |
| `cloudinary.ts` | — | Cloudinary URL generation |
| `onboarding-slides.tsx` | — | Onboarding slide configuration |
| `updates.ts` | — | OTA update helpers |
| `pushNotifications.ts` | — | Push notification helpers |
| `index.ts` | `scale`, `verticalScale`, `moderateScale`, `nameFn`, `hslToHex`, `hexToHSL`, `getRandomNamedColor` | Scaling, color utils |

### Toast Usage

```typescript
import toast from '@/utils/toast'

toast.info('Message')
toast.error('Error message')
toast.success('Success!')

// Also available globally (set in root layout):
global.toast.show('Message')
```

### Scaling

```typescript
import {scale, verticalScale, moderateScale} from '@/utils'
```

---

## 17. Storage (MMKV)

```typescript
import {
  saveToVault,
  getFromVault,
  deleteFromVault,
  valueExistsInVault,
  clearSession,
  resetAppStorage,
  zustandStorage
} from '@/utils/storage'

// Save
saveToVault('accessToken', token)

// Read
const user = getFromVault('user')

// Check existence
const hasToken = valueExistsInVault('accessToken')

// Clear session (deletes tokens + optionally routes)
clearSession()                // → /login
clearSession('expired')       // → /login + toast "session expired"
clearSession('fresh-login')   // → /fresh-login
clearSession('no-route')      // just clears tokens

// Full reset (logout/switch user)
resetAppStorage()             // deletes all vault keys + clears query cache
```

`zustandStorage` is the MMKV adapter for Zustand's `persist` middleware.

---

## 18. Known Issues & Gotchas

### Missing `store/storeStore.ts`

Multiple modals import `useStoreId` and `useSubdomain` from `@/store/storeStore`. This file does not exist. Check if it was renamed or needs to be created before working on features that use store/subdomain.

### Orphaned Repository Files

These exist in `api/` but are **not** registered in `api/index.ts` (not accessible via `api.*`):
- `analyticsRepository.ts`
- `ordersRepository.ts`
- `settlementsRepository.ts`
- `storesRepository.ts`
- `transactionsRepository.ts`

If you need these endpoints, either import directly or add to `api/index.ts`.

### `authService.refreshToken` Endpoint

The refresh token service uses `refreshClient.get('')` — the endpoint path may be incomplete. Verify with the backend before relying on silent token refresh.

### `env.ts` is Gitignored

`constants/ApiConstants.ts` imports from `../env`. This file is local-only. If `env.ts` is missing, the app won't compile. Template from `app.json`:
```typescript
export default {
  BASE_URL: 'https://your-api.example.com',
  DEV_BASE_URL: 'https://dev-api.example.com',
  CLOUDINARY_NAME: 'your-cloudinary-name'
}
```

### Sentry DSN & Paystack Key in Source

`app/_layout.tsx` contains hardcoded Sentry DSN and Paystack test key. These should be moved to `env.ts` for production.

### Push Notifications Commented Out

Push notification setup in `app/_layout.tsx` is fully commented out. The `usePushNotifications` hook and store exist but are not wired.

### `useMediaPersmissions` Typo

The hook file is named `useMediaPersmissions.ts` (typo: "Persmissions"). Match exactly when importing.

### OTP Timer Sync

OTP countdown timers for signup (`verifyAccountTimer`) and password reset (`resetPasswordTimer`) are stored in `AsyncStorage` — separate from MMKV vault. The end time is `now + 2.25 * 60000` ms (2 min 15 sec).

### `publicClient` vs `apiClient` Response Unwrapping

`publicClient` has a response interceptor that auto-unwraps to `response.data` — so responses from public endpoints return the data directly. `apiClient` does **not** auto-unwrap — responses retain the full axios shape; you access `.data` manually.

---

## 19. Conventions & Patterns

### Imports

Always use the `@/` path alias (mapped to repo root via `tsconfig.json`).

```typescript
import {api} from '@/api'
import {useAuthActions} from '@/store/authStore'
import {Box, Typography, Button} from '@/components/ui'
import {theme} from '@/theme'
```

### Error Handling in Stores

Wrap async actions in try/catch and call `errorHandler(err)`:

```typescript
try {
  set(state => ({loadingState: {...state.loadingState, someAction: true}}))
  // ... do work
  set(state => ({loadingState: {...state.loadingState, someAction: false}}))
} catch (err) {
  set(state => ({loadingState: {...state.loadingState, someAction: false}}))
  errorHandler(err)
}
```

### Loading State Pattern

Each Zustand store has a `loadingState` object with boolean keys per action. Always set loading `true` at start and `false` in both success and catch paths.

### Form Pattern

Use **Formik** for complex forms (see `add-or-edit-product.tsx`). Use Yup schemas for validation.

### Modal Pattern

Bottom-sheet modals use `@gorhom/bottom-sheet` via the re-exported `AppModal` / `EUModal` from `components/ui/modal`. The `ModalProvider` is in the root layout.

### Shared Components

- Stats cards: `components/shared/stats-card`
- Grouped-by-date lists: `components/shared/grouped-by-date`
- Sales items: `components/shared/sales-item`
- Status cards: `components/shared/status-card`
- Refer widget: `components/shared/refer`
- Floating action button: `components/shared/floating-button`

### SVGs

All SVG illustrations and icons live as TSX components in `components/svgs/`. Import and use as regular components.

### Screen Container

Wrap screen content with `ScreenView` from `components/util/screen-view` or `Container` from `components/ui/container`.

### Keyboard Handling

- In regular screens: wrap in `KeyboardAwareScrollView` from `components/util/keyboard-aware-scroll-view`
- In modals: wrap in `ModalKeyboardAwareScrollView` from `components/util/modal-keyboard-aware-scroll-view`
- Root layout also provides `KeyboardProvider` and `KeyboardToolbar` from `react-native-keyboard-controller`

### `__DEV__` Guard

Sentry is only initialized in production (`if (!__DEV__)`). The app export is:
```typescript
const SalesRepApp = __DEV__ ? App : Sentry.wrap(App)
```

---

*Last updated: April 2026*
