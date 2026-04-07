import {useState} from 'react'
import {AppIcon, TextField, TextFieldProps} from '@/components/ui'

type SearchFieldProps = Omit<TextFieldProps, 'name' | 'value' | 'onChangeText'> & {
  name?: string
  /** Current search query (controlled). Omit for uncontrolled. */
  query?: string
  /** Called when the query text changes. */
  onQueryChange?: (query: string) => void
  /** Called when the user submits search (e.g. keyboard submit). */
  onSearch?: (query: string) => void
}

export function SearchField({
  name = 'search',
  placeholder = 'Search',
  query: controlledQuery,
  onQueryChange,
  onSearch,
  onSubmitEditing,
  ...props
}: SearchFieldProps) {
  const [internalQuery, setInternalQuery] = useState('')
  const isControlled = controlledQuery !== undefined
  const query = isControlled ? controlledQuery : internalQuery

  const handleChangeText = (text: string) => {
    if (!isControlled) setInternalQuery(text)
    onQueryChange?.(text)
  }

  const handleSubmitEditing = (
    e: Parameters<NonNullable<TextFieldProps['onSubmitEditing']>>[0]
  ) => {
    onSearch?.(query)
    onSubmitEditing?.(e)
  }

  return (
    <TextField
      name={name}
      placeholder={placeholder}
      prefixIcon={<AppIcon name="Search" size={16} color="#111111" />}
      value={query}
      onChangeText={handleChangeText}
      onSubmitEditing={handleSubmitEditing}
      returnKeyType="search"
      {...props}
    />
  )
}
