export interface SelectraOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
  children?: SelectraOption[]
  icon?: React.ReactNode
}

export interface SelectraProps {
  options: SelectraOption[]
  value?: SelectraOption[]
  defaultValue?: SelectraOption[]
  onChange?: (selected: SelectraOption[]) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
  searchable?: boolean
  maxSelected?: number
  noOptionsMessage?: string
  loadingMessage?: string
  className?: string
  dropdownClassName?: string
  tagClassName?: string
  onSearch?: (query: string) => void
  onOpen?: () => void
  onClose?: () => void
  renderOption?: (option: SelectraOption, isSelected: boolean) => React.ReactNode
  renderTag?: (option: SelectraOption, onRemove: () => void) => React.ReactNode
  closeOnSelect?: boolean
  groupBy?: boolean
  nested?: boolean
  defaultExpandedKeys?: string[]
  expandAllByDefault?: boolean
  async?: boolean
  id?: string
  name?: string
  required?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
}

export interface SelectraState {
  isOpen: boolean
  searchQuery: string
  highlightedIndex: number
  selectedOptions: SelectraOption[]
  expandedKeys: Set<string>
}

export type SelectraAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_HIGHLIGHTED'; payload: number }
  | { type: 'SELECT_OPTION'; payload: SelectraOption }
  | { type: 'REMOVE_OPTION'; payload: SelectraOption }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_OPTIONS'; payload: SelectraOption[] }
  | { type: 'TOGGLE_EXPAND'; payload: string }
  | { type: 'SET_EXPANDED_KEYS'; payload: Set<string> }
