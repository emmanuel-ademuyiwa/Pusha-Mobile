import React, {useEffect, useState} from 'react'

import Typography from '../typography'

export const BlinkingCursor = () => {
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(state => !state)
    }, 500)
    return () => clearInterval(interval)
  })

  const text: string = isVisible ? '|' : ''
  return (
    <Typography color="neutral-700" variant="h3">
      {text}
    </Typography>
  )
}

export default BlinkingCursor
