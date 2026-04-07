import {GroupedByDate} from '@/components/shared'
import {
  Box,
  Button,
  Container,
  EmptyState,
  PageError,
  PushaActivityIndicator,
  Typography
} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {useGetNotifications, useMarkAllAsRead, useMarkAsRead} from '@/queries/notificationsQuery'
import {INotification} from '@/types'
import {formatTime} from '@/utils/datetime'
import React from 'react'
import {Linking} from 'react-native'

const URL_REGEX = /https?:\/\/[^\s]+/

const extractUrl = (body: string): string | null => {
  const match = body?.match(URL_REGEX)
  return match ? match[0] : null
}

const NotificationItem = ({
  item,
  onMarkRead,
}: {
  item: INotification
  onMarkRead: (id: string) => void
}) => {
  const isUnread = !item.read_at
  const actionUrl = extractUrl(item.body)
  const hasActions = isUnread || !!actionUrl

  return (
    <Box
      p={14}
      borderRadius={12}
      mb={8}
      style={{backgroundColor: isUnread ? '#EEF2FF' : '#FFFFFF'}}>
      {/* Title row */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mb={6}>
        <Typography
          variant="body-semibold"
          color="secondary-500"
          style={{flex: 1, marginRight: 8}}
          numberOfLines={1}>
          {item.title || 'Notification'}
        </Typography>
        <Box flexDirection="row" alignItems="center" gap={6}>
          <Typography variant="c2" color="neutral-600">
            at {formatTime(item.created_at)}
          </Typography>
          {isUnread && (
            <Box
              width={8}
              height={8}
              borderRadius={4}
              style={{backgroundColor: '#2554CF'}}
            />
          )}
        </Box>
      </Box>

      {/* Body text */}
      <Typography variant="c1" color="neutral-900" numberOfLines={3}>
        {item.body || 'No message content'}
      </Typography>

      {/* Action buttons */}
      {hasActions && (
        <Box flexDirection="row" gap={8} mt={10}>
          {actionUrl && (
            <Box style={{flexShrink: 1}}>
              <Button
                size="sm"
                label="View Chat"
                onPress={() => Linking.openURL(actionUrl)}
              />
            </Box>
          )}
          {isUnread && (
            <Box style={{flexShrink: 1}}>
              <Button
                size="sm"
                label="Mark Read"
                onPress={() => onMarkRead(item.id)}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

const Page = () => {
  const {data: notifications, isLoading, isError, refetch} = useGetNotifications()
  const {mutate: markAsRead} = useMarkAsRead()
  const {mutate: markAllAsRead, isPending: isMarkingAllAsRead} = useMarkAllAsRead()

  const renderHeaderAction = () => {
    if (!notifications?.records || notifications.records.length === 0) return null
    return (
      <Button
        variant="tertiary"
        size="sm"
        label="Mark all read"
        loading={isMarkingAllAsRead}
        onPress={() => markAllAsRead()}
      />
    )
  }

  if (isLoading) {
    return (
      <ScreenView hasTopBanner={false} alignNav="center" navTitle="Notifications">
        <Box alignItems="center" justifyContent="center" flex={1}>
          <PushaActivityIndicator />
        </Box>
      </ScreenView>
    )
  }

  if (isError) {
    return <PageError reload={() => refetch().then(() => {})} />
  }

  return (
    <ScreenView
      hasTopBanner={false}
      alignNav="center"
      navTitle="Notifications"
      headerAction={renderHeaderAction()}>
      <Container flex={1}>
        <Box mt={16}>
          {notifications?.records && notifications.records.length > 0 ? (
            <GroupedByDate
              data={notifications.records}
              dateKey="created_at"
              renderItem={(item: INotification) => (
                <NotificationItem
                  item={item}
                  onMarkRead={id => markAsRead(id)}
                />
              )}
            />
          ) : (
            <EmptyState
              title="No notifications"
              description="You don't have any notifications yet. We'll notify you when something important happens."
              actionText="Refresh"
              onAction={refetch}
            />
          )}
        </Box>
      </Container>
    </ScreenView>
  )
}

export default Page
