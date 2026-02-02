import { useReducer, useCallback, useRef, useEffect, useMemo } from 'react'
import type { SelectraOption, SelectraState, SelectraAction, SelectraProps } from '../types'

const initialState: SelectraState = {
  isOpen: false,
  searchQuery: '',
  highlightedIndex: -1,
  selectedOptions: [],
  expandedKeys: new Set<string>(),
}

function selectraReducer(state: SelectraState, action: SelectraAction): SelectraState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true, highlightedIndex: 0 }
    case 'CLOSE':
      return { ...state, isOpen: false, searchQuery: '', highlightedIndex: -1 }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload, highlightedIndex: 0 }
    case 'SET_HIGHLIGHTED':
      return { ...state, highlightedIndex: action.payload }
    case 'SELECT_OPTION':
      if (state.selectedOptions.some(opt => opt.value === action.payload.value)) {
        return state
      }
      return {
        ...state,
        selectedOptions: [...state.selectedOptions, action.payload],
        searchQuery: '',
      }
    case 'REMOVE_OPTION':
      return {
        ...state,
        selectedOptions: state.selectedOptions.filter(
          opt => opt.value !== action.payload.value
        ),
      }
    case 'CLEAR_ALL':
      return { ...state, selectedOptions: [] }
    case 'SET_OPTIONS':
      return { ...state, selectedOptions: action.payload }
    case 'TOGGLE_EXPAND': {
      const newExpanded = new Set(state.expandedKeys)
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload)
      } else {
        newExpanded.add(action.payload)
      }
      return { ...state, expandedKeys: newExpanded }
    }
    case 'SET_EXPANDED_KEYS':
      return { ...state, expandedKeys: action.payload }
    default:
      return state
  }
}

// Helper to flatten nested options for keyboard navigation
function flattenOptions(
  options: SelectraOption[],
  expandedKeys: Set<string>,
  selectedValues: Set<string>,
  searchQuery: string,
  depth = 0
): Array<{ option: SelectraOption; depth: number; hasChildren: boolean }> {
  const result: Array<{ option: SelectraOption; depth: number; hasChildren: boolean }> = []

  for (const option of options) {
    const hasChildren = option.children && option.children.length > 0
    const matchesSearch = option.label.toLowerCase().includes(searchQuery.toLowerCase())
    const isSelected = selectedValues.has(option.value)

    // Check if any children match search
    const childrenMatchSearch = hasChildren && option.children!.some(child =>
      child.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (child.children && flattenOptions([child], expandedKeys, selectedValues, searchQuery).length > 0)
    )

    if ((matchesSearch || childrenMatchSearch) && !isSelected) {
      result.push({ option, depth, hasChildren: !!hasChildren })

      // If has children and is expanded (or searching), include children
      if (hasChildren && (expandedKeys.has(option.value) || searchQuery)) {
        const childResults = flattenOptions(
          option.children!,
          expandedKeys,
          selectedValues,
          searchQuery,
          depth + 1
        )
        result.push(...childResults)
      }
    }
  }

  return result
}

// Helper to get all keys for expanding all by default
function getAllKeys(options: SelectraOption[]): string[] {
  const keys: string[] = []
  for (const option of options) {
    if (option.children && option.children.length > 0) {
      keys.push(option.value)
      keys.push(...getAllKeys(option.children))
    }
  }
  return keys
}

export function useSelectra(props: SelectraProps) {
  const {
    options,
    value,
    defaultValue,
    onChange,
    onSearch,
    onOpen,
    onClose,
    maxSelected,
    closeOnSelect = false,
    searchable = true,
    nested = false,
    defaultExpandedKeys = [],
    expandAllByDefault = false,
  } = props

  const isControlled = value !== undefined

  // Calculate initial expanded keys
  const initialExpandedKeys = useMemo(() => {
    if (expandAllByDefault) {
      return new Set(getAllKeys(options))
    }
    return new Set(defaultExpandedKeys)
  }, [])

  const [state, dispatch] = useReducer(selectraReducer, {
    ...initialState,
    selectedOptions: value ?? defaultValue ?? [],
    expandedKeys: initialExpandedKeys,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Sync controlled value
  useEffect(() => {
    if (isControlled && value) {
      dispatch({ type: 'SET_OPTIONS', payload: value })
    }
  }, [isControlled, value])

  // Get selected values as Set for quick lookup
  const selectedValues = useMemo(
    () => new Set(state.selectedOptions.map(opt => opt.value)),
    [state.selectedOptions]
  )

  // Filter and flatten options based on search and nested structure
  const flattenedOptions = useMemo(() => {
    if (nested) {
      return flattenOptions(options, state.expandedKeys, selectedValues, state.searchQuery)
    }

    // Non-nested filtering
    return options
      .filter(option => {
        const matchesSearch = option.label
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase())
        const isSelected = selectedValues.has(option.value)
        return matchesSearch && !isSelected
      })
      .map(option => ({ option, depth: 0, hasChildren: false }))
  }, [options, state.expandedKeys, selectedValues, state.searchQuery, nested])

  // For backward compatibility
  const filteredOptions = useMemo(
    () => flattenedOptions.map(item => item.option),
    [flattenedOptions]
  )

  // Group options if needed (only for non-nested)
  const groupedOptions = props.groupBy && !nested
    ? filteredOptions.reduce((groups, option) => {
        const group = option.group || 'Other'
        if (!groups[group]) groups[group] = []
        groups[group].push(option)
        return groups
      }, {} as Record<string, SelectraOption[]>)
    : null

  const canSelectMore = !maxSelected || state.selectedOptions.length < maxSelected

  const open = useCallback(() => {
    if (props.disabled) return
    dispatch({ type: 'OPEN' })
    onOpen?.()
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [props.disabled, onOpen])

  const close = useCallback(() => {
    dispatch({ type: 'CLOSE' })
    onClose?.()
  }, [onClose])

  const toggle = useCallback(() => {
    if (state.isOpen) {
      close()
    } else {
      open()
    }
  }, [state.isOpen, open, close])

  const setSearch = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH', payload: query })
    onSearch?.(query)
  }, [onSearch])

  const toggleExpand = useCallback((optionValue: string) => {
    dispatch({ type: 'TOGGLE_EXPAND', payload: optionValue })
  }, [])

  const selectOption = useCallback((option: SelectraOption) => {
    if (!canSelectMore || option.disabled) return

    // If option has children and nested mode, toggle expand instead of select
    if (nested && option.children && option.children.length > 0) {
      toggleExpand(option.value)
      return
    }

    dispatch({ type: 'SELECT_OPTION', payload: option })

    const newSelected = [...state.selectedOptions, option]
    onChange?.(newSelected)

    if (closeOnSelect) {
      close()
    } else {
      inputRef.current?.focus()
    }
  }, [canSelectMore, state.selectedOptions, onChange, closeOnSelect, close, nested, toggleExpand])

  const removeOption = useCallback((option: SelectraOption) => {
    dispatch({ type: 'REMOVE_OPTION', payload: option })
    const newSelected = state.selectedOptions.filter(
      opt => opt.value !== option.value
    )
    onChange?.(newSelected)
  }, [state.selectedOptions, onChange])

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' })
    onChange?.([])
  }, [onChange])

  const highlightOption = useCallback((index: number) => {
    dispatch({ type: 'SET_HIGHLIGHTED', payload: index })
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (props.disabled) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!state.isOpen) {
          open()
        } else {
          const nextIndex = Math.min(
            state.highlightedIndex + 1,
            flattenedOptions.length - 1
          )
          highlightOption(nextIndex)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (state.isOpen) {
          const prevIndex = Math.max(state.highlightedIndex - 1, 0)
          highlightOption(prevIndex)
        }
        break
      case 'ArrowRight':
        // Expand nested option
        if (state.isOpen && nested && flattenedOptions[state.highlightedIndex]) {
          const { option, hasChildren } = flattenedOptions[state.highlightedIndex]
          if (hasChildren && !state.expandedKeys.has(option.value)) {
            toggleExpand(option.value)
          }
        }
        break
      case 'ArrowLeft':
        // Collapse nested option
        if (state.isOpen && nested && flattenedOptions[state.highlightedIndex]) {
          const { option, hasChildren } = flattenedOptions[state.highlightedIndex]
          if (hasChildren && state.expandedKeys.has(option.value)) {
            toggleExpand(option.value)
          }
        }
        break
      case 'Enter':
        e.preventDefault()
        if (state.isOpen && flattenedOptions[state.highlightedIndex]) {
          selectOption(flattenedOptions[state.highlightedIndex].option)
        } else if (!state.isOpen) {
          open()
        }
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
      case 'Backspace':
        if (
          state.searchQuery === '' &&
          state.selectedOptions.length > 0 &&
          searchable
        ) {
          const lastOption = state.selectedOptions[state.selectedOptions.length - 1]
          removeOption(lastOption)
        }
        break
      case 'Tab':
        if (state.isOpen) {
          close()
        }
        break
    }
  }, [
    props.disabled,
    state.isOpen,
    state.highlightedIndex,
    state.searchQuery,
    state.selectedOptions,
    state.expandedKeys,
    flattenedOptions,
    open,
    close,
    highlightOption,
    selectOption,
    removeOption,
    searchable,
    nested,
    toggleExpand,
  ])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [close])

  // Scroll highlighted option into view
  useEffect(() => {
    if (state.isOpen && listRef.current && state.highlightedIndex >= 0) {
      const highlightedElement = listRef.current.children[
        state.highlightedIndex
      ] as HTMLElement
      highlightedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [state.isOpen, state.highlightedIndex])

  return {
    state,
    refs: { containerRef, inputRef, listRef },
    filteredOptions,
    flattenedOptions,
    groupedOptions,
    canSelectMore,
    actions: {
      open,
      close,
      toggle,
      setSearch,
      selectOption,
      removeOption,
      clearAll,
      highlightOption,
      handleKeyDown,
      toggleExpand,
    },
  }
}
