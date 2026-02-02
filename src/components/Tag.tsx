import type { SelectraOption } from '../types'

interface TagProps {
  option: SelectraOption
  onRemove: () => void
  disabled?: boolean
  className?: string
  renderTag?: (option: SelectraOption, onRemove: () => void) => React.ReactNode
}

export function Tag({ option, onRemove, disabled, className, renderTag }: TagProps) {
  if (renderTag) {
    return <>{renderTag(option, onRemove)}</>
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      onRemove()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault()
      e.stopPropagation()
      onRemove()
    }
  }

  return (
    <span
      className={`selectra-tag ${className || ''}`}
      data-disabled={disabled || undefined}
    >
      <span className="selectra-tag-label">{option.label}</span>
      <button
        type="button"
        className="selectra-tag-remove"
        onClick={handleRemove}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={`Remove ${option.label}`}
        tabIndex={-1}
      >
        <svg
          width="14"
          height="14"
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
    </span>
  )
}
