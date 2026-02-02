import type { SelectraOption } from '../types'

interface NestedOptionProps {
  option: SelectraOption
  depth: number
  hasChildren: boolean
  isExpanded: boolean
  isHighlighted: boolean
  onSelect: () => void
  onToggleExpand: () => void
  onMouseEnter: () => void
  renderOption?: (option: SelectraOption, isSelected: boolean) => React.ReactNode
}

export function NestedOption({
  option,
  depth,
  hasChildren,
  isExpanded,
  isHighlighted,
  onSelect,
  onToggleExpand,
  onMouseEnter,
  renderOption,
}: NestedOptionProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!option.disabled) {
      if (hasChildren) {
        onToggleExpand()
      } else {
        onSelect()
      }
    }
  }

  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleExpand()
  }

  const paddingLeft = 12 + depth * 20

  if (renderOption) {
    return (
      <li
        role="option"
        aria-selected={false}
        aria-disabled={option.disabled}
        aria-expanded={hasChildren ? isExpanded : undefined}
        data-highlighted={isHighlighted || undefined}
        data-disabled={option.disabled || undefined}
        data-depth={depth}
        className="selectra-option selectra-option-custom selectra-option-nested"
        style={{ paddingLeft }}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
      >
        {hasChildren && (
          <button
            type="button"
            className="selectra-expand-btn"
            onClick={handleExpandClick}
            tabIndex={-1}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isExpanded ? 'selectra-expand-icon expanded' : 'selectra-expand-icon'}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
        {renderOption(option, false)}
      </li>
    )
  }

  return (
    <li
      role="option"
      aria-selected={false}
      aria-disabled={option.disabled}
      aria-expanded={hasChildren ? isExpanded : undefined}
      data-highlighted={isHighlighted || undefined}
      data-disabled={option.disabled || undefined}
      data-depth={depth}
      data-has-children={hasChildren || undefined}
      className="selectra-option selectra-option-nested"
      style={{ paddingLeft }}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
    >
      {hasChildren && (
        <button
          type="button"
          className="selectra-expand-btn"
          onClick={handleExpandClick}
          tabIndex={-1}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isExpanded ? 'selectra-expand-icon expanded' : 'selectra-expand-icon'}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
      {option.icon && <span className="selectra-option-icon">{option.icon}</span>}
      <span className="selectra-option-label">{option.label}</span>
    </li>
  )
}
