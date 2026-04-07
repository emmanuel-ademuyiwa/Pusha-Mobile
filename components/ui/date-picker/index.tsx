import React, {useEffect, useState} from 'react'
import DatePicker from 'react-native-date-picker'

import {Box} from '../box'
import TextField from '../text-field'

interface BZDatePickerProps {
  maximumDate?: Date
  minimumDate?: Date
  label?: string
  placeholder?: string
  onConfirm: (date: Date) => void
  value?: Date
}

export const BZDatePicker = ({
  maximumDate,
  minimumDate,
  label,
  placeholder,
  onConfirm,
  value
}: BZDatePickerProps) => {
  const [date, setDate] = useState<Date>(value ?? new Date())
  const [open, setOpen] = useState<boolean>(false)
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    if (value) {
      setDate(new Date(value))
      setFormattedDate(
        new Date(value).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      )
    } else {
      setFormattedDate('')
      setDate(new Date())
    }
  }, [value])

  return (
    <Box>
      <TextField
        name="date"
        value={formattedDate}
        label={label}
        placeholder={placeholder}
        onPress={() => setOpen(true)}
        editable={false}
      />
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={selectedDate => {
          setDate(selectedDate)
          setFormattedDate(
            selectedDate.toLocaleDateString('en-US', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          )
          setOpen(false)
          onConfirm(selectedDate)
        }}
        onCancel={() => setOpen(false)}
        mode="date"
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    </Box>
  )
}
