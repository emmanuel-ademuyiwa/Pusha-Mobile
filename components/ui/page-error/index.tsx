import React from 'react'

import {AppView} from '../app-view'
import {BackButton} from '../back-button'
import {Box} from '../box'
import {Container} from '../container'
import {DisplayState} from '../display-state'
import {TextAction} from '../text-action'
import {Typography} from '../typography'

export const PageError = (props: {
  title?: string
  backButton?: boolean
  reload: () => Promise<void>
}) => {
  const {title, backButton = true, reload} = props
  return (
    <AppView>
      <Box flex={1} backgroundColor="white" paddingTop={12}>
        <Container flex={1}>
          {backButton && <BackButton />}

          <Box flex={1} backgroundColor="white">
            {title && (
              <Typography variant="h1-bold" mt={16}>
                {title}
              </Typography>
            )}
            <Box
              flex={1}
              backgroundColor="white"
              alignItems="center"
              justifyContent="center">
              <DisplayState
                subText="Uh oh, an error was encountered"
                state="error">
                <TextAction
                  textAlign="center"
                  iconName="replace"
                  iconPosition="start"
                  onPress={() => reload()}>
                  Try again
                </TextAction>
              </DisplayState>
            </Box>
          </Box>
        </Container>
      </Box>
    </AppView>
  )
}

export default PageError
