# Pusha - React Native E-commerce Mobile App

## Overview

Pusha is a React Native mobile application built with Expo for e-commerce management. It's a business-focused app that allows merchants to manage products, track sales, handle customers, and run their online business operations.

## Tech Stack

- **Framework**: React Native with Expo (~53.0.8)
- **Routing**: Expo Router (~5.0.6) with file-based routing
- **State Management**: Zustand (^5.0.4) for client state
- **Server State**: TanStack Query (^5.75.7) with AsyncStorage persistence
- **UI Library**: Shopify Restyle (^2.4.5) for design system
- **Forms**: Formik (^2.4.6) with Yup validation (^1.6.1)
- **HTTP Client**: Axios (^1.9.0)
- **Styling**: React Native StyleSheet with Restyle theme system
- **Animations**: React Native Reanimated (~3.17.4)
- **Navigation**: Expo Router with typed routes
- **Error Tracking**: Sentry (^6.13.1)
- **Storage**: React Native MMKV (^3.2.0) and AsyncStorage
- **Image Handling**: Expo Image with Cloudinary integration

## Project Structure

```
pusha/
├── api/                          # API layer with repository pattern
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                   # Authenticated routes
│   │   ├── (tabs)/               # Tab navigation screens
│   │   └── (more)/               # Additional authenticated screens
│   └── (public)/                 # Public/unauthenticated routes
├── components/                   # Reusable UI components
│   ├── modals/                   # Modal components
│   ├── screens/                  # Screen-specific components
│   ├── shared/                   # Shared business components
│   ├── svgs/                     # SVG icon components
│   └── ui/                       # Design system components
├── constants/                    # App constants and query keys
├── hooks/                        # Custom React hooks
├── queries/                      # TanStack Query hooks
├── schemas/                      # Form validation schemas
├── store/                        # Zustand stores
├── theme/                        # Design system theme
├── types/                        # TypeScript type definitions
└── utils/                        # Utility functions
```

## Architecture Patterns

### 1. State Management Architecture

The app uses a hybrid approach:

- **Client State**: Zustand stores for local UI state and business logic
- **Server State**: TanStack Query for API data with caching and synchronization
- **Persistent State**: MMKV for secure storage and AsyncStorage for query persistence

#### Zustand Store Pattern

```typescript
// Example: store/authStore.ts
const useAuthStore = create<AuthStoreType>()((set, get) => ({
  loadingState: { /* loading states for different actions */ },
  actions: {
    login: async (payload) => { /* implementation */ },
    logout: async () => { /* implementation */ }
  }
}))

// Export selective hooks for optimal re-renders
export const useAuthActions = () => useAuthStore(state => state.actions)
export const useAuthLoadingState = () => useAuthStore(state => state.loadingState)
```

### 2. API Layer Architecture

Repository pattern with typed endpoints:

```typescript
// api/authRepository.ts
export default {
  login: (payload: LoginPayload) => UseEndpoint({
    clientType: 'public',
    endpoint: '/auth/signin',
    method: HttpMethods.Post,
    payload
  })
}

// Centralized API object
export const api = {
  auth: AuthRepository,
  products: ProductsRepository,
  merchants: MerchantsRepository
}
```

### 3. Component Architecture

Uses Shopify Restyle for consistent design system:

```typescript
// Design system components with theme variants
const Button = createRestyleComponent<ButtonProps, Theme>([
  variant({ themeKey: 'buttonVariants' }),
  spacing,
  border
], Pressable)
```

### 4. Query Architecture

TanStack Query for server state with custom hooks:

```typescript
// queries/productsQuery.ts
export const useListProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: async () => {
      const response = await api.products.listProducts()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5
  })
}
```

## Development Patterns

### Common Commands

```bash
# Development (package manager: pnpm)
pnpm run start              # Start Expo dev server
pnpm run dev:ios           # Start with iOS
pnpm run dev:android       # Start with Android
pnpm run lint              # Run ESLint

# Building
pnpm run android           # Run on Android
pnpm run ios              # Run on iOS
```

### File Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `TextField.tsx`)
- **Screens**: kebab-case in folders (`dashboard.tsx`, `products.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuthActions.ts`)
- **Types**: PascalCase interfaces with `I` prefix when needed
- **Stores**: camelCase with `Store` suffix (`authStore.ts`)

### Import Organization

```typescript
// 1. React and third-party imports
import React from 'react'
import {useQuery} from '@tanstack/react-query'

// 2. Internal imports with @ alias
import {api} from '@/api'
import {Button, Box} from '@/components/ui'
import {useAuthActions} from '@/store/authStore'
```

## Key Features

### Authentication Flow
- Email/password registration and login
- OTP verification for email
- Password reset with OTP
- Biometric authentication support
- Secure token storage with MMKV

### Business Management
- Product catalog with categories and collections
- Inventory tracking and stock analytics
- Sales recording and analytics
- Customer management
- Business profile setup

### UI/UX Features
- Tab-based navigation with custom components
- Modal system for forms and confirmations
- Loading states and error handling
- Toast notifications
- Haptic feedback
- Dark/light theme support

## Development Guidelines

### Adding New Features

1. **Create API Repository Method**:
   ```typescript
   // api/newFeatureRepository.ts
   export default {
     createItem: (payload) => UseEndpoint({
       endpoint: '/new-feature',
       method: HttpMethods.Post,
       payload
     })
   }
   ```

2. **Create Query Hook**:
   ```typescript
   // queries/newFeatureQuery.ts
   export const useCreateItem = () => {
     return useMutation({
       mutationFn: (payload) => api.newFeature.createItem(payload)
     })
   }
   ```

3. **Add to Store if Needed**:
   ```typescript
   // store/newFeatureStore.ts
   const useNewFeatureStore = create<StoreType>()((set) => ({
     // state and actions
   }))
   ```

### Component Development

Use the design system components:

```typescript
import {Box, Typography, Button} from '@/components/ui'

const MyComponent = () => (
  <Box padding={16} backgroundColor="white">
    <Typography variant="h2" color="text-primary">
      Title
    </Typography>
    <Button 
      variant="primary" 
      onPress={handlePress}
      label="Action"
    />
  </Box>
)
```

### Error Handling

Use the centralized error handler:

```typescript
import {errorHandler} from '@/utils/errorHandler'

try {
  await api.someAction()
} catch (err) {
  errorHandler(err) // Shows appropriate user feedback
}
```

### Form Handling

Use Formik with Yup validation:

```typescript
import {Formik} from 'formik'
import * as Yup from 'yup'

const schema = Yup.object().shape({
  email: Yup.string().email().required()
})

const MyForm = () => (
  <Formik
    initialValues={{email: ''}}
    validationSchema={schema}
    onSubmit={handleSubmit}
  >
    {/* form implementation */}
  </Formik>
)
```

### Navigation

Use Expo Router's typed navigation:

```typescript
import {router} from 'expo-router'

// Navigate to screens
router.push('/products/123')
router.replace('/dashboard')
router.back()
```

## Testing & Quality

- ESLint with Expo config for code quality
- Prettier for code formatting
- TypeScript for type safety
- Sentry for error tracking in production

## Performance Considerations

- TanStack Query caching reduces API calls
- MMKV for fast, secure storage
- Image optimization with Expo Image
- Lazy loading and code splitting where appropriate
- Optimized re-renders with selective Zustand subscriptions

## Security Features

- Secure token storage with MMKV
- Biometric authentication
- API request interceptors for auth headers
- Environment-based configuration
- Sentry for monitoring and error tracking

## Environment Configuration

The app uses environment-specific configurations in `app.json`:

```json
{
  "extra": {
    "ENV": {
      "BASE_URL": "https://api-staging.pushahq.com",
      "CLOUDINARY_NAME": "delzblzt7"
    }
  }
}
```

This architecture provides a scalable, maintainable foundation for the Pusha e-commerce mobile application with clear separation of concerns and modern React Native development practices.