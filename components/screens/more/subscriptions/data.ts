export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  recommended?: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    interval: 'monthly',
    features: ['Up to 10 products', 'Basic analytics', 'Email support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 5000,
    interval: 'monthly',
    features: ['Unlimited products', 'Advanced analytics', 'Priority support', 'Custom store'],
    recommended: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 15000,
    interval: 'monthly',
    features: ['Everything in Growth', 'Team access', 'API access', 'Dedicated account manager'],
  },
]
