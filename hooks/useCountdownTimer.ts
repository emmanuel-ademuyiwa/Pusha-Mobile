import AsyncStorage from '@react-native-async-storage/async-storage'
import {useCallback, useEffect, useState} from 'react'
import {AppState} from 'react-native'

/**
 * A custom React hook for creating a countdown timer with AsyncStorage persistence.
 * @param {string} timerName - The unique identifier for the timer in AsyncStorage.
 * @param {number} cooldownDurationInMinutes - The duration of the cooldown period in minutes.
 * @param {function} onFinishCallback - An optional callback function to be called when the timer finishes.
 */

const useCountdownTimer = (
  timerName: string,
  cooldownDurationInMinutes: number,
  onFinishCallback?: () => void
) => {
  const [remainingTime, setRemainingTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  const loadEndTime = useCallback(async () => {
    const endTime = await AsyncStorage.getItem(timerName)
    if (endTime) {
      const now = new Date().getTime()
      const endTimeMillis = parseInt(endTime, 10)
      const differenceInSeconds = Math.floor((endTimeMillis - now) / 1000)
      if (differenceInSeconds <= 0) {
        // Timer has ended
        setRemainingTime(0)
        onFinishCallback && onFinishCallback()
      } else {
        setRemainingTime(differenceInSeconds)
        setTimerActive(true)
      }
    }
  }, [onFinishCallback, timerName])

  useEffect(() => {
    loadEndTime().then()
  }, [loadEndTime])

  const checkTimer = useCallback(async () => {
    const endTime = await AsyncStorage.getItem(timerName)
    if (endTime) {
      const now = new Date().getTime()
      const endTimeMillis = parseInt(endTime, 10)
      const differenceInSeconds = Math.floor((endTimeMillis - now) / 1000)
      if (differenceInSeconds <= 0) {
        // Timer has ended
        await AsyncStorage.removeItem(timerName)
        return false
      }
      return true
    } else {
      return false
    }
  }, [timerName])

  const startTimer = useCallback(async () => {
    const existingEndTime = await AsyncStorage.getItem(timerName)
    if (existingEndTime) {
      const now = new Date().getTime()
      const endTimeMillis = parseInt(existingEndTime, 10)
      const differenceInSeconds = Math.floor((endTimeMillis - now) / 1000)
      if (differenceInSeconds <= 0) {
        // Timer has ended, reset it
        await AsyncStorage.removeItem(timerName)
        setRemainingTime(0)
        setTimerActive(false)
        return
      }
      setRemainingTime(differenceInSeconds)
      setTimerActive(true)
    } else {
      const now = new Date().getTime()
      const endTime = now + cooldownDurationInMinutes * 60000
      await AsyncStorage.setItem(timerName, endTime.toString())
      setRemainingTime(cooldownDurationInMinutes * 60)
      setTimerActive(true)
    }
  }, [cooldownDurationInMinutes, timerName])

  const resetTimer = useCallback(async () => {
    await AsyncStorage.removeItem(timerName)
    setRemainingTime(0)
    setTimerActive(false)
  }, [timerName])

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined

    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active' && timerActive) {
        await loadEndTime()
      }
    }

    const tick = async () => {
      setRemainingTime(prevTime => {
        if (prevTime === 0) {
          clearInterval(intervalId)
          setTimerActive(false)
          onFinishCallback && onFinishCallback()
          // Remove the timer entry from AsyncStorage
          AsyncStorage.removeItem(timerName)
          return 0
        }
        return prevTime - 1
      })
    }

    if (timerActive) {
      intervalId = setInterval(tick, 1000) // Update time every second
    }

    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      clearInterval(intervalId)
    }
  }, [timerActive, onFinishCallback, timerName, loadEndTime])

  // Format time into minutes and seconds
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60

  return {
    /**
     * The remaining time in seconds on the countdown timer.
     * @type {number}
     */
    remainingTime,

    /**
     * The remaining minutes on the countdown timer.
     * @type {number}
     */
    minutes,

    /**
     * The remaining seconds on the countdown timer.
     * @type {number}
     */
    seconds,

    /**
     * Starts the countdown timer or continues it from where it left off.
     * If there is an existing timer in AsyncStorage, it resumes from the remaining time.
     * Otherwise, it starts a new timer with the specified cooldown duration.
     * @function
     */
    startTimer,

    /**
     * Resets the countdown timer by removing the timer entry from AsyncStorage.
     * @function
     */
    resetTimer,

    /**
     * Indicates whether the countdown timer is currently active.
     * @type {boolean}
     */
    timerActive,

    /**
     * Checks if there is an existing timer in AsyncStorage.
     * @function
     * @returns {boolean} True if there is an existing timer, false otherwise.
     */
    checkTimer
  }
}

export default useCountdownTimer
