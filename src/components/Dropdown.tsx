import type { SelectraOption } from '../types'
import { Option } from './Option'
import { NestedOption } from './NestedOption'

interface FlattenedOption {
  option: SelectraOption
  depth: number
  hasChildren: boolean
}

interface DropdownProps {
  options: SelectraOption[]
  flattenedOptions?: FlattenedOption[]
  groupedOptions: Record<string, SelectraOption[]> | null
  highlightedIndex: number
  expandedKeys?: Set<string>
  nested?: boolean
  onSelect: (option: SelectraOption) => void
  onHighlight: (index: number) => void
  onToggleExpand?: (value: string) => void
  noOptionsMessage: string
  loadingMessage: string
  loading?: boolean
  className?: string
  listRef: React.Ref<HTMLUListElement>
  renderOption?: (option: SelectraOption, isSelected: boolean) => React.ReactNode
  id: string
}

export function Dropdown({
  options,
  flattenedOptions,
  groupedOptions,
  highlightedIndex,
  expandedKeys,
  nested,
  onSelect,
  onHighlight,
  onToggleExpand,
  noOptionsMessage,
  loadingMessage,
  loading,
  className,
  listRef,
  renderOption,
  id,
}: DropdownProps) {
  if (loading) {
    return (
      <div className={`selectra-dropdown ${className || ''}`}>
        <div className="selectra-loading">{loadingMessage}</div>
      </div>
    )
  }

  const displayOptions = flattenedOptions || options.map(opt => ({ option: opt, depth: 0, hasChildren: false }))

  if (displayOptions.length === 0) {
    return (
      <div className={`selectra-dropdown ${className || ''}`}>
        <div className="selectra-no-options">{noOptionsMessage}</div>
      </div>
    )
  }

  // Nested rendering
  if (nested && flattenedOptions) {
    return (
      <div className={`selectra-dropdown ${className || ''}`}>
        <ul
          ref={listRef}
          className="selectra-options selectra-options-nested"
          role="listbox"
          id={id}
          aria-multiselectable="true"
        >
          {flattenedOptions.map((item, index) => (
            <NestedOption
              key={item.option.value}
              option={item.option}
              depth={item.depth}
              hasChildren={item.hasChildren}
              isExpanded={expandedKeys?.has(item.option.value) || false}
              isHighlighted={highlightedIndex === index}
              onSelect={() => onSelect(item.option)}
              onToggleExpand={() => onToggleExpand?.(item.option.value)}
              onMouseEnter={() => onHighlight(index)}
              renderOption={renderOption}
            />
          ))}
        </ul>
      </div>
    )
  }

  // Grouped rendering
  if (groupedOptions) {
    let flatIndex = 0
    return (
      <div className={`selectra-dropdown ${className || ''}`}>
        <ul
          ref={listRef}
          className="selectra-options"
          role="listbox"
          id={id}
          aria-multiselectable="true"
        >
          {Object.entries(groupedOptions).map(([group, groupOptions]) => (
            <li key={group} className="selectra-group">
              <div className="selectra-group-label">{group}</div>
              <ul className="selectra-group-options" role="group">
                {groupOptions.map(option => {
                  const currentIndex = flatIndex++
                  return (
                    <Option
                      key={option.value}
                      option={option}
                      isHighlighted={highlightedIndex === currentIndex}
                      onSelect={() => onSelect(option)}
                      onMouseEnter={() => onHighlight(currentIndex)}
                      renderOption={renderOption}
                    />
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Default flat rendering
  return (
    <div className={`selectra-dropdown ${className || ''}`}>
      <ul
        ref={listRef}
        className="selectra-options"
        role="listbox"
        id={id}
        aria-multiselectable="true"
      >
        {options.map((option, index) => (
          <Option
            key={option.value}
            option={option}
            isHighlighted={highlightedIndex === index}
            onSelect={() => onSelect(option)}
            onMouseEnter={() => onHighlight(index)}
            renderOption={renderOption}
          />
        ))}
      </ul>
    </div>
  )
}
