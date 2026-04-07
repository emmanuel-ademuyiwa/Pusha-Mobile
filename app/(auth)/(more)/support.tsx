import {AppIcon, Box, Container, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import React from 'react'
import {TouchableOpacity, Linking} from 'react-native'

const SUPPORT_OPTIONS = [
  {id: 'email', title: 'Email Support', subtitle: 'support@pushahq.com', icon: 'Mail', action: () => Linking.openURL('mailto:support@pushahq.com')},
  {id: 'chat', title: 'Live Chat', subtitle: 'Chat with our support team', icon: 'MessageCircle', action: () => {}},
  {id: 'faq', title: 'FAQ', subtitle: 'Browse frequently asked questions', icon: 'HelpCircle', action: () => {}},
]

const Page = () => (
  <ScreenView navTitle="Support" alignNav="center" hasTopBanner={false}>
    <Container>
      <Box mt={16} gap={8}>
        {SUPPORT_OPTIONS.map(opt => (
          <TouchableOpacity key={opt.id} onPress={opt.action} activeOpacity={0.7}>
            <Box flexDirection="row" alignItems="center" backgroundColor="white" borderRadius={12}
              p={16} borderWidth={1} style={{borderColor: '#E9EAEB'}} gap={12}>
              <Box width={40} height={40} borderRadius={20} backgroundColor="light-primary"
                alignItems="center" justifyContent="center">
                <AppIcon name={opt.icon as any} size={20} color="#2554C7" />
              </Box>
              <Box flex={1}>
                <Typography variant="body-semibold" color="secondary-500">{opt.title}</Typography>
                <Typography variant="c1" color="neutral-600" mt={2}>{opt.subtitle}</Typography>
              </Box>
              <AppIcon name="ChevronRight" size={16} color="#94A3B8" />
            </Box>
          </TouchableOpacity>
        ))}
      </Box>
    </Container>
  </ScreenView>
)

export default Page
