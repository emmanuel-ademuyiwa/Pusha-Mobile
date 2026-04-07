import {Box, TextAction, Typography} from '@/components/ui'

type SectionHeaderProps = {
  title: string
  titleVariant?: 'h3-bold'
  onActionPress?: () => void
}

export function SectionHeader({
  title,
  titleVariant = 'h3-bold',
  onActionPress
}: SectionHeaderProps) {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center">
      <Typography variant={titleVariant}>{title}</Typography>
      {onActionPress ? (
        <TextAction variant="body-bold" color="neutral-900" onPress={onActionPress}>
          View all
        </TextAction>
      ) : null}
    </Box>
  )
}
