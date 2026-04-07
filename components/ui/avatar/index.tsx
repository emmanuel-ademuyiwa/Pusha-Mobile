import {Image} from 'expo-image'
import React from 'react'
import {ViewStyle} from 'react-native'

import Box from '../box'
import Typography from '../typography'

// Defining prop types for the component
interface AvatarProps {
  src?: string
  name: string
  size?: number // Optional with a default value set in the component
}

export const Avatar: React.FC<AvatarProps> = ({src, name, size = 50}) => {
  // Function to get initials from a name
  const getInitials = (merchantName: string): string => {
    let initials: any = merchantName.match(/\b\w/g) || []

    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
    return initials
  }

  // Function to generate a background color based on the name

  const avatarStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const imagePlaceholder = require('../../../assets/image-placeholder.png')

  return (
    <Box style={avatarStyle}>
      {src ? (
        <Image
          placeholder={imagePlaceholder}
          placeholderContentFit="cover"
          accessibilityIgnoresInvertColors
          source={{uri: src}}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2
          }}
        />
      ) : (
        <Typography variant="c1-bold" color="white">
          {getInitials(name)}
        </Typography>
      )}
    </Box>
  )
}

export default Avatar
