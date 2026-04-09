import type {IChatSession} from '@/queries/chatsQuery'

export function getCustomerName(chat: IChatSession): string {
  const c = chat.customer
  if (!c) return 'Unknown Visitor'
  const full = [c.first_name, c.last_name].filter(Boolean).join(' ')
  return full || 'Unknown Visitor'
}

export function getCustomerInitial(chat: IChatSession): string {
  const c = chat.customer
  if (!c || !c.first_name) return '?'
  return c.first_name[0].toUpperCase()
}

export function getCustomerSubtitle(chat: IChatSession): string {
  const c = chat.customer
  if (!c) return chat.channel
  return c.email ?? c.phone_number ?? chat.channel
}
