interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder: string
  disabled?: boolean
  inputRef: React.Ref<HTMLInputElement>
  isOpen: boolean
  listId: string
  id?: string
  name?: string
  required?: boolean
  ariaLabel?: string
  ariaLabelledby?: string
}

export function SearchInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  inputRef,
  isOpen,
  listId,
  id,
  name,
  required,
  ariaLabel,
  ariaLabelledby,
}: SearchInputProps) {
  return (
    <input
      ref={inputRef}
      type="text"
      className="selectra-search"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={listId}
      aria-autocomplete="list"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      id={id}
      name={name}
      required={required}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
    />
  )
}
