import type { SelectraOption } from '../types'

interface OptionProps {
  option: SelectraOption
  isHighlighted: boolean
  onSelect: () => void
  onMouseEnter: () => void
  renderOption?: (option: SelectraOption, isSelected: boolean) => React.ReactNode
}

export function Option({
  option,
  isHighlighted,
  onSelect,
  onMouseEnter,
  renderOption,
}: OptionProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!option.disabled) {
      onSelect()
    }
  }

  if (renderOption) {
    return (
      <li
        role="option"
        aria-selected={false}
        aria-disabled={option.disabled}
        data-highlighted={isHighlighted || undefined}
        data-disabled={option.disabled || undefined}
        className="selectra-option selectra-option-custom"
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
      >
        {renderOption(option, false)}
      </li>
    )
  }

  return (
    <li
      role="option"
      aria-selected={false}
      aria-disabled={option.disabled}
      data-highlighted={isHighlighted || undefined}
      data-disabled={option.disabled || undefined}
      className="selectra-option"
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
    >
      {option.label}
    </li>
  )
}
