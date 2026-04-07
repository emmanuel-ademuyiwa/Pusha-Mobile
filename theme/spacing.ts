function populateObjectWithNumbers() {
  const obj: Record<number, number> = {}

  const positiveNumbers = Array.from({length: 1000}, (_, i) => i + 1)
  const negativeNumbers = Array.from({length: 1000}, (_, i) => -(i + 1))

  for (const num of positiveNumbers) {
    obj[num] = num
  }

  for (const num of negativeNumbers) {
    obj[num] = num
  }

  return obj
}

const spacingObj = populateObjectWithNumbers()

export const spacing = {
  ...spacingObj
}
