import {Dimensions} from 'react-native'

const {width, height} = Dimensions.get('window')

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350
const guidelineBaseHeight = 680

const scale = (size: number) => (width / guidelineBaseWidth) * size
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor

export {scale, verticalScale, moderateScale}

export const nameFn = (name: string) => {
  if (name) {
    const names = name.split(' ')

    return {
      firstName: names[0],
      lastName: names[1]
    }
  } else {
    return {
      firstName: '',
      lastName: ''
    }
  }
}

export const getFileExtFromUri = (uri: string) => {
  const uriParts = uri.split('.')
  return uriParts[uriParts.length - 1]
}

export const hslToHex = (hsl: string): string => {
  // Extracting values from HSL string
  const match = hsl.match(/(\d+(\.\d+)?)/g)
  if (!match || match.length < 3) {
    throw new Error('Invalid HSL string')
  }
  const h = parseFloat(match[0]) / 360
  const s = parseFloat(match[1]) / 100
  const l = parseFloat(match[2]) / 100

  // Function to convert hue to RGB
  function hueToRGB(m1: number, m2: number, hue: number) {
    if (hue < 0) hue += 1
    if (hue > 1) hue -= 1
    if (hue * 6 < 1) return m1 + (m2 - m1) * hue * 6
    if (hue * 2 < 1) return m2
    if (hue * 3 < 2) return m1 + (m2 - m1) * (2 / 3 - hue) * 6
    return m1
  }

  let r, g, b

  if (s === 0) {
    // eslint-disable-next-line no-multi-assign
    r = g = b = l
  } else {
    const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s
    const m1 = l * 2 - m2
    r = hueToRGB(m1, m2, h + 1 / 3)
    g = hueToRGB(m1, m2, h)
    b = hueToRGB(m1, m2, h - 1 / 3)
  }

  // Converting RGB to hexadecimal
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export const hexToHSL = (hex: string) => {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16)
    g = parseInt(hex[3] + hex[4], 16)
    b = parseInt(hex[5] + hex[6], 16)
  }

  // Then to HSL
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2

  if (max === min) {
    h = 0
    s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    // @ts-ignore
    h /= 6
  }

  // @ts-ignore
  return `hsl(${Math.floor(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`
}

export const isValidFileSystemFile = (uri: string): boolean => {
  // List of special strings to check for
  const specialStrings: string[] = ['file://', 'file:///']

  // Check if any of the special strings is in the input string
  return specialStrings.some(specialString => uri.startsWith(specialString))
}

export function getRandomNamedColor(idx: number): string {
  const namedColors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Purple',
    'Cyan',
    'Magenta',
    'Orange',
    'Pink',
    'Brown',
    'Black',
    'White',
    'Gray',
    'Lime',
    'Navy',
    'Teal',
    'Olive',
    'Maroon',
    'Silver',
    'Gold'
  ]
  // const randomIndex = Math.floor(Math.random() * namedColors.length)
  return namedColors[idx]
}
