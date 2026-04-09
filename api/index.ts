import AuthRepository from './authRepository'
import BankAccountRepository from './bankAccountRepository'
import ChatsRepository from './chatsRepository'
import CommunicationsRepository from './communicationsRepository'
import CustomersRepository from './customersRepository'
import EarningsRepository from './earningsRepository'
import ExpensesRepository from './expensesRepository'
import MerchantsRepository from './merchantsRespository'
import NotificationsRepository from './notificationsRepository'
import PaymentsRepository from './paymentsRepository'
import productsRepository from './productsRepository'
import publicRepository from './publicRepository'
import ReferralsRepository from './referralsRepository'
import SalesRepository from './salesRepository'
import SocialsRepository from './socialsRepository'
import SubscriptionRepository from './subscriptionRepository'
import UserRepository from './userRepository'
import WalletRepository from './walletRepository'
import WebchatRepository from './webchatRepository'

export const api = {
  merchants: MerchantsRepository,
  public: publicRepository,
  communications: CommunicationsRepository,
  auth: AuthRepository,
  customers: CustomersRepository,
  products: productsRepository,
  payments: PaymentsRepository,
  sales: SalesRepository,
  expenses: ExpensesRepository,
  user: UserRepository,
  socials: SocialsRepository,
  subscription: SubscriptionRepository,
  earnings: EarningsRepository,
  wallet: WalletRepository,
  bankAccount: BankAccountRepository,
  referrals: ReferralsRepository,
  notifications: NotificationsRepository,
  chats: ChatsRepository,
  webchat: WebchatRepository
}

export default api
