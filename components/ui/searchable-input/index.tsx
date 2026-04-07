import Box from '@/components/ui/box'
import Typography from '@/components/ui/typography'
import React, {useState} from 'react'
import {FlatList, StyleSheet, TextInput, TouchableOpacity} from 'react-native'

interface OptionItem {
  value: string
  text?: string
  label?: string
}

interface SearchableInputProps {
  name?: string
  label?: string
  placeholder?: string
  options: OptionItem[]
  value?: string
  /** Called whenever the text input changes (free-text entry) */
  onChangeText?: (text: string) => void
  /** Called when the user picks an option, passes the option value */
  onChangeSelect?: (value: string) => void
  /** Legacy — same as onChangeSelect */
  onSelect?: (value: string) => void
}

export const SearchableInput = ({
  label,
  placeholder = 'Search…',
  options,
  value,
  onChangeText,
  onChangeSelect,
  onSelect,
}: SearchableInputProps) => {
  const [query, setQuery] = useState(value ?? '')
  const [open, setOpen] = useState(false)

  const displayLabel = (opt: OptionItem) => opt.text ?? opt.label ?? opt.value

  const filtered = options.filter(o =>
    displayLabel(o).toLowerCase().includes(query.toLowerCase()),
  )

  const handleChangeText = (t: string) => {
    setQuery(t)
    setOpen(true)
    onChangeText?.(t)
  }

  const handleSelect = (opt: OptionItem) => {
    setQuery(displayLabel(opt))
    setOpen(false)
    onChangeSelect?.(opt.value)
    onSelect?.(opt.value)
  }

  return (
    <Box>
      {label ? (
        <Typography variant="c1-medium" color="neutral-600" mb={6}>
          {label}
        </Typography>
      ) : null}

      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        onFocus={() => setOpen(true)}
      />

      {open && filtered.length > 0 ? (
        <Box style={styles.dropdown}>
          <FlatList
            data={filtered}
            keyExtractor={item => item.value}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item)}>
                <Typography variant="c1" color="secondary-500">
                  {displayLabel(item)}
                </Typography>
              </TouchableOpacity>
            )}
          />
        </Box>
      ) : null}
    </Box>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#E9EAEB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#142952',
    backgroundColor: '#fff',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E9EAEB',
    borderRadius: 8,
    maxHeight: 200,
    backgroundColor: '#fff',
    marginTop: 4,
    zIndex: 999,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
})

export default SearchableInput
