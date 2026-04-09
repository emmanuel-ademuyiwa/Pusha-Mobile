import React, {PropsWithChildren, ReactNode} from 'react'
import {AppView, BackButton, Box, Container, Divider, Typography} from '../ui'

import {ThemeColors} from '@/theme'

interface ScreenViewProps {
  backAction?: () => void
  headerAction?: ReactNode
  navTitle?: ReactNode
  title?: string | ReactNode
  subHeader?: string | ReactNode
  backButton?: boolean
  headerDivider?: boolean
  footerPadding?: boolean
  hasTopBanner?: boolean
  color?: ThemeColors
  alignNav?: 'center' | 'left'
}

export const ScreenView: React.FC<
  PropsWithChildren<ScreenViewProps>
> = props => {
  const {
    backAction,
    children,
    title,
    backButton = true,
    headerDivider = false,
    footerPadding = true,
    hasTopBanner = true,
    color = 'white'
  } = props
  return (
    <AppView
      footerPadding={footerPadding}
      hasTopBanner={hasTopBanner}
      color={color}>
      <Box flex={1}>
        <Container>
          {(props.navTitle || backButton || props.headerAction) && (
            <Box
              flexDirection="row"
              justifyContent={
                props.alignNav === 'center' ? 'space-between' : 'flex-start'
              }
              alignItems="center"
              gap={props.alignNav !== 'center' ? 8 : undefined}>
              {backButton && (
                <Box ml={-16}>
                  <BackButton color="black" customAction={backAction} />
                </Box>
              )}
              {!backButton && props.alignNav === 'center' && (
                <Box width={40} height={40} />
              )}
              {props.navTitle && typeof props.navTitle === 'string' ? (
                <Typography
                  color="secondary-500"
                  fontSize={props.alignNav === 'center' ? 17 : 17}
                  lineHeight={33}
                  variant={'h3-bold'}>
                  {props.navTitle}
                </Typography>
              ) : props.navTitle ? (
                <Box flex={1} minWidth={0}>
                  {props.navTitle}
                </Box>
              ) : null}
              {props.alignNav === 'center' &&
                props.navTitle &&
                !props.headerAction && <Box width={40} height={40} />}
              {props.headerAction && props.headerAction}
            </Box>
          )}
          {title && (
            <Box mt={16}>
              {typeof title === 'string' ? (
                <Typography
                  color="secondary-500"
                  fontSize={22}
                  lineHeight={28}
                  variant="h3-bold">
                  {title}
                </Typography>
              ) : (
                title
              )}
            </Box>
          )}
        </Container>
        {headerDivider && <Divider />}
        {children}
      </Box>
    </AppView>
  )
}
