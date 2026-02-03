# Selectra React

A powerful, searchable multi-select dropdown component with tag support for React.

**Created by [Sayed Abdul Karim](https://github.com/saykarim)**

[![npm version](https://img.shields.io/npm/v/selectra-react?style=flat-square)](https://www.npmjs.com/package/selectra-react)
[![npm downloads](https://img.shields.io/npm/dm/selectra-react?style=flat-square)](https://www.npmjs.com/package/selectra-react)
[![license](https://img.shields.io/npm/l/selectra-react?style=flat-square)](https://github.com/saykarim/selectra-react/blob/main/LICENSE)

## Demo

Check out the live playground: **[https://selectra-playground-production.up.railway.app/](https://selectra-playground-production.up.railway.app/)**

## Features

- Searchable dropdown with real-time filtering
- Multi-select with tag/chip display
- **Nested/hierarchical options** with expand/collapse
- Keyboard navigation (Arrow keys, Enter, Escape, Backspace)
- Fully accessible (ARIA attributes)
- Grouped options support
- Maximum selection limit
- Customizable styling with CSS variables
- Dark mode support
- TypeScript support
- Lightweight with zero dependencies

## Installation

```bash
npm install selectra-react
```

```bash
yarn add selectra-react
```

```bash
pnpm add selectra-react
```

## Quick Start

```tsx
import { Selectra } from 'selectra-react'
import 'selectra-react/styles.css'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

function App() {
  const [selected, setSelected] = useState([])

  return (
    <Selectra
      options={options}
      value={selected}
      onChange={setSelected}
      placeholder="Select fruits..."
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectraOption[]` | required | Array of options to display |
| `value` | `SelectraOption[]` | - | Controlled selected values |
| `defaultValue` | `SelectraOption[]` | `[]` | Initial selected values (uncontrolled) |
| `onChange` | `(selected: SelectraOption[]) => void` | - | Called when selection changes |
| `placeholder` | `string` | `"Select..."` | Placeholder text when empty |
| `searchPlaceholder` | `string` | `"Search..."` | Placeholder for search input |
| `searchable` | `boolean` | `true` | Enable search functionality |
| `clearable` | `boolean` | `true` | Show clear all button |
| `disabled` | `boolean` | `false` | Disable the component |
| `loading` | `boolean` | `false` | Show loading state |
| `maxSelected` | `number` | - | Maximum number of selections |
| `groupBy` | `boolean` | `false` | Group options by `group` property |
| `nested` | `boolean` | `false` | Enable nested/hierarchical options |
| `expandAllByDefault` | `boolean` | `false` | Expand all nested options initially |
| `defaultExpandedKeys` | `string[]` | `[]` | Keys of options to expand by default |
| `closeOnSelect` | `boolean` | `false` | Close dropdown after selection |
| `noOptionsMessage` | `string` | `"No options found"` | Message when no options match |
| `loadingMessage` | `string` | `"Loading..."` | Message during loading |
| `className` | `string` | - | Class for container |
| `dropdownClassName` | `string` | - | Class for dropdown |
| `tagClassName` | `string` | - | Class for tags |
| `renderOption` | `(option, isSelected) => ReactNode` | - | Custom option renderer |
| `renderTag` | `(option, onRemove) => ReactNode` | - | Custom tag renderer |
| `onSearch` | `(query: string) => void` | - | Called on search input change |
| `onOpen` | `() => void` | - | Called when dropdown opens |
| `onClose` | `() => void` | - | Called when dropdown closes |

## Option Type

```ts
interface SelectraOption {
  value: string
  label: string
  disabled?: boolean
  group?: string              // Used with groupBy prop
  children?: SelectraOption[] // Used with nested prop
  icon?: React.ReactNode      // Optional icon
}
```

## Examples

### Nested/Hierarchical Options

```tsx
const categories = [
  {
    value: 'electronics',
    label: 'Electronics',
    children: [
      {
        value: 'phones',
        label: 'Phones',
        children: [
          { value: 'iphone', label: 'iPhone' },
          { value: 'samsung', label: 'Samsung Galaxy' },
        ],
      },
      { value: 'laptops', label: 'Laptops' },
    ],
  },
  { value: 'clothing', label: 'Clothing' },
]

<Selectra options={categories} nested expandAllByDefault />
```

### Grouped Options

```tsx
const options = [
  { value: 'react', label: 'React', group: 'Frontend' },
  { value: 'vue', label: 'Vue.js', group: 'Frontend' },
  { value: 'node', label: 'Node.js', group: 'Backend' },
  { value: 'python', label: 'Python', group: 'Backend' },
]

<Selectra options={options} groupBy />
```

### Maximum Selection

```tsx
<Selectra
  options={options}
  maxSelected={3}
  placeholder="Select up to 3..."
/>
```

### Disabled Options

```tsx
const options = [
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Unavailable', disabled: true },
]

<Selectra options={options} />
```

### Custom Rendering

```tsx
<Selectra
  options={options}
  renderOption={(option) => (
    <div className="custom-option">
      <span className="icon">{option.icon}</span>
      <span>{option.label}</span>
    </div>
  )}
  renderTag={(option, onRemove) => (
    <span className="custom-tag">
      {option.label}
      <button onClick={onRemove}>×</button>
    </span>
  )}
/>
```

## Styling

Selectra uses CSS variables for easy customization:

```css
.selectra {
  --selectra-primary: #3b82f6;
  --selectra-primary-light: #eff6ff;
  --selectra-border: #d1d5db;
  --selectra-border-focus: #3b82f6;
  --selectra-bg: #ffffff;
  --selectra-bg-hover: #f3f4f6;
  --selectra-bg-highlighted: #eff6ff;
  --selectra-text: #111827;
  --selectra-text-muted: #6b7280;
  --selectra-tag-bg: #e5e7eb;
  --selectra-tag-text: #374151;
  --selectra-radius: 8px;
}
```

### Dark Mode

Selectra automatically supports dark mode via `prefers-color-scheme`. You can also force a theme:

```tsx
// Force dark mode
<Selectra className="selectra-dark" options={options} />

// Force light mode
<Selectra className="selectra-light" options={options} />
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↓` | Open dropdown / Move to next option |
| `↑` | Move to previous option |
| `→` | Expand nested option (when using `nested` prop) |
| `←` | Collapse nested option (when using `nested` prop) |
| `Enter` | Select highlighted option / Toggle expand for parent nodes |
| `Escape` | Close dropdown |
| `Backspace` | Remove last selected tag (when search is empty) |
| `Tab` | Close dropdown and move focus |

## Hook Usage

For advanced use cases, you can use the `useSelectra` hook directly:

```tsx
import { useSelectra } from 'selectra-react'

function CustomSelect(props) {
  const {
    state,
    refs,
    filteredOptions,
    flattenedOptions,
    actions,
  } = useSelectra(props)

  // Build your own UI
}
```

## Author

**Sayed Abdul Karim**

- GitHub: [@saykarim](https://github.com/saykarim)

## License

MIT © [Sayed Abdul Karim](https://github.com/saykarim)
