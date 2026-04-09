import Step1Details from '@/components/screens/business-setup/step1-details'
import Step2Catalogue from '@/components/screens/business-setup/step2-catalogue'
import Step3Connect from '@/components/screens/business-setup/step3-connect'
import Step4Preview from '@/components/screens/business-setup/step4-preview'
import {AppIcon, Box, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {router} from 'expo-router'
import React, {useState} from 'react'
import {StyleSheet} from 'react-native'

type OnboardingStep = 1 | 2 | 3 | 4

const STEP_LABELS = ['Details', 'Catalogue', 'Connect', 'Preview'] as const

const StepProgress = ({current}: {current: OnboardingStep}) => {
  return (
    <Box
      flexDirection="row"
      alignItems="flex-start"
      paddingHorizontal={16}
      paddingBottom={12}
      paddingTop={8}>
      {STEP_LABELS.map((label, idx) => {
        const stepNum = (idx + 1) as OnboardingStep
        const isComplete = current > stepNum
        const isActive = current === stepNum
        const isLast = idx === STEP_LABELS.length - 1

        return (
          <React.Fragment key={label}>
            <Box alignItems="center" gap={4} style={styles.stepItem}>
              <Box
                width={28}
                height={28}
                borderRadius={14}
                alignItems="center"
                justifyContent="center"
                style={[
                  styles.stepCircle,
                  (isComplete || isActive) && styles.stepCircleActive
                ]}>
                {isComplete ? (
                  <AppIcon name="Check" size={12} color="#fff" />
                ) : (
                  <Typography
                    variant="c1-medium"
                    color={isActive ? 'white' : 'neutral-900'}>
                    {stepNum}
                  </Typography>
                )}
              </Box>
                <Typography
                  variant="c1"
                  color={isActive || isComplete ? 'primary-300' : 'neutral-700'}>
                {label}
              </Typography>
            </Box>
            {!isLast && (
              <Box
                flex={1}
                height={1}
                style={[
                  styles.stepLine,
                  isComplete && styles.stepLineActive
                ]}
              />
            )}
          </React.Fragment>
        )
      })}
    </Box>
  )
}

const Page = () => {
  const [step, setStep] = useState<OnboardingStep>(1)

  return (
    <ScreenView
      navTitle="Set up Business"
      alignNav="center"
      hasTopBanner={false}
      backButton={false}>
      <Box flex={1}>
        <StepProgress current={step} />
        <Box flex={1}>
          {step === 1 && (
            <Step1Details handleNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <Step2Catalogue
              handleNext={() => setStep(3)}
              handleBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3Connect
              handleNext={() => setStep(4)}
              handleBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <Step4Preview
              handleNext={() =>
                router.replace('/(auth)/(more)/subscriptions')
              }
              handleBack={() => setStep(3)}
            />
          )}
        </Box>
      </Box>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  stepItem: {
    minWidth: 48
  },
  stepCircle: {
    backgroundColor: '#E8E8E8'
  },
  stepCircleActive: {
    backgroundColor: '#2554C7'
  },
  stepLine: {
    backgroundColor: '#E8E8E8',
    marginTop: 14,
    alignSelf: 'flex-start'
  },
  stepLineActive: {
    backgroundColor: '#2554C7'
  }
})

export default Page
