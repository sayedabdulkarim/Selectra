import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Selectra } from './Selectra'

const mockOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Disabled Option', disabled: true },
]

describe('Selectra', () => {
  it('renders with placeholder', () => {
    render(<Selectra options={mockOptions} placeholder="Select items..." />)
    expect(screen.getByPlaceholderText('Select items...')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    render(<Selectra options={mockOptions} />)
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('shows options in dropdown', async () => {
    render(<Selectra options={mockOptions} />)
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('selects an option on click', async () => {
    const onChange = vi.fn()
    render(<Selectra options={mockOptions} onChange={onChange} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.click(screen.getByText('Option 1'))

    expect(onChange).toHaveBeenCalledWith([mockOptions[0]])
  })

  it('displays selected options as tags', () => {
    render(
      <Selectra
        options={mockOptions}
        defaultValue={[mockOptions[0], mockOptions[1]]}
      />
    )

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('removes tag on click', async () => {
    const onChange = vi.fn()
    render(
      <Selectra
        options={mockOptions}
        defaultValue={[mockOptions[0]]}
        onChange={onChange}
      />
    )

    const removeButton = screen.getByLabelText('Remove Option 1')
    await userEvent.click(removeButton)

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('has searchable input', async () => {
    render(<Selectra options={mockOptions} />)

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('clears all selections when clear button is clicked', async () => {
    const onChange = vi.fn()
    render(
      <Selectra
        options={mockOptions}
        defaultValue={[mockOptions[0], mockOptions[1]]}
        onChange={onChange}
      />
    )

    const clearButton = screen.getByLabelText('Clear all')
    await userEvent.click(clearButton)

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('respects maxSelected limit', async () => {
    render(
      <Selectra
        options={mockOptions}
        maxSelected={2}
        defaultValue={[mockOptions[0], mockOptions[1]]}
      />
    )

    const input = screen.getByRole('combobox')
    await userEvent.click(input)

    expect(screen.getByText('Maximum selections reached')).toBeInTheDocument()
  })

  it('accepts noOptionsMessage prop', () => {
    render(<Selectra options={[]} noOptionsMessage="Nothing found" />)

    // Component renders without error
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Selectra options={mockOptions} disabled />)
    const container = document.querySelector('.selectra')
    expect(container).toHaveAttribute('data-disabled')
  })

  it('closes dropdown on escape', async () => {
    render(<Selectra options={mockOptions} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
