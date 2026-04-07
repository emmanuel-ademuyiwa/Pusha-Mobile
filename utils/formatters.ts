export const dashToSentence = (str: string) => {
  return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export default {dashToSentence}
