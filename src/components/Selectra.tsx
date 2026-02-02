import { useId } from 'react'
import type { SelectraProps } from '../types'
import { useSelectra } from '../hooks/useSelectra'
import { Tag } from './Tag'
import { Dropdown } from './Dropdown'
import { SearchInput } from './SearchInput'

export function Selectra(props: SelectraProps) {
  const {
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    disabled = false,
    loading = false,
    clearable = true,
    searchable = true,
    noOptionsMessage = 'No options found',
    loadingMessage = 'Loading...',
    className,
    dropdownClassName,
    tagClassName,
    renderOption,
    renderTag,
    id: propsId,
    name,
    required,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
  } = props

  const autoId = useId()
  const id = propsId || autoId
  const listId = `${id}-listbox`

  const {
    state,
    refs,
    filteredOptions,
    flattenedOptions,
    groupedOptions,
    canSelectMore,
    actions,
  } = useSelectra(props)

  const hasSelected = state.selectedOptions.length > 0

  return (
    <div
      ref={refs.containerRef}
      className={`selectra ${className || ''}`}
      data-open={state.isOpen || undefined}
      data-disabled={disabled || undefined}
      data-has-value={hasSelected || undefined}
    >
      <div
        className="selectra-control"
        onClick={actions.toggle}
        onKeyDown={actions.handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={state.isOpen}
      >
        <div className="selectra-value-container">
          {state.selectedOptions.map(option => (
            <Tag
              key={option.value}
              option={option}
              onRemove={() => actions.removeOption(option)}
              disabled={disabled}
              className={tagClassName}
              renderTag={renderTag}
            />
          ))}

          {searchable ? (
            <SearchInput
              value={state.searchQuery}
              onChange={actions.setSearch}
              onKeyDown={actions.handleKeyDown}
              placeholder={hasSelected ? searchPlaceholder : placeholder}
              disabled={disabled}
              inputRef={refs.inputRef}
              isOpen={state.isOpen}
              listId={listId}
              id={id}
              name={name}
              required={required && !hasSelected}
              ariaLabel={ariaLabel}
              ariaLabelledby={ariaLabelledby}
            />
          ) : (
            !hasSelected && (
              <span className="selectra-placeholder">{placeholder}</span>
            )
          )}
        </div>

        <div className="selectra-indicators">
          {clearable && hasSelected && !disabled && (
            <button
              type="button"
              className="selectra-clear"
              onClick={e => {
                e.stopPropagation()
                actions.clearAll()
              }}
              aria-label="Clear all"
              tabIndex={-1}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <span className="selectra-separator" />

          <span className="selectra-arrow" data-open={state.isOpen || undefined}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {state.isOpen && canSelectMore && (
        <Dropdown
          options={filteredOptions}
          flattenedOptions={flattenedOptions}
          groupedOptions={groupedOptions}
          highlightedIndex={state.highlightedIndex}
          expandedKeys={state.expandedKeys}
          nested={props.nested}
          onSelect={actions.selectOption}
          onHighlight={actions.highlightOption}
          onToggleExpand={actions.toggleExpand}
          noOptionsMessage={noOptionsMessage}
          loadingMessage={loadingMessage}
          loading={loading}
          className={dropdownClassName}
          listRef={refs.listRef}
          renderOption={renderOption}
          id={listId}
        />
      )}

      {state.isOpen && !canSelectMore && (
        <div className={`selectra-dropdown ${dropdownClassName || ''}`}>
          <div className="selectra-max-selected">
            Maximum selections reached
          </div>
        </div>
      )}
    </div>
  )
}
