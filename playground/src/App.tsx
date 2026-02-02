import { useState } from 'react'
import { Selectra, SelectraOption } from 'selectra-react'
import '../../src/styles/selectra.css'

const fruits: SelectraOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'dragonfruit', label: 'Dragon Fruit' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'honeydew', label: 'Honeydew' },
]

const techStack: SelectraOption[] = [
  { value: 'react', label: 'React', group: 'Frontend' },
  { value: 'vue', label: 'Vue.js', group: 'Frontend' },
  { value: 'angular', label: 'Angular', group: 'Frontend' },
  { value: 'svelte', label: 'Svelte', group: 'Frontend' },
  { value: 'node', label: 'Node.js', group: 'Backend' },
  { value: 'python', label: 'Python', group: 'Backend' },
  { value: 'go', label: 'Go', group: 'Backend' },
  { value: 'rust', label: 'Rust', group: 'Backend' },
  { value: 'postgres', label: 'PostgreSQL', group: 'Database' },
  { value: 'mongodb', label: 'MongoDB', group: 'Database' },
  { value: 'redis', label: 'Redis', group: 'Database' },
]

const countries: SelectraOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'mx', label: 'Mexico', disabled: true },
]

// Nested categories example
const categories: SelectraOption[] = [
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
          { value: 'pixel', label: 'Google Pixel' },
        ],
      },
      {
        value: 'laptops',
        label: 'Laptops',
        children: [
          { value: 'macbook', label: 'MacBook' },
          { value: 'thinkpad', label: 'ThinkPad' },
          { value: 'xps', label: 'Dell XPS' },
        ],
      },
      { value: 'tablets', label: 'Tablets' },
      { value: 'accessories', label: 'Accessories' },
    ],
  },
  {
    value: 'clothing',
    label: 'Clothing',
    children: [
      { value: 'mens', label: "Men's" },
      { value: 'womens', label: "Women's" },
      { value: 'kids', label: "Kids'" },
    ],
  },
  {
    value: 'home',
    label: 'Home & Garden',
    children: [
      { value: 'furniture', label: 'Furniture' },
      { value: 'decor', label: 'Decor' },
      { value: 'garden', label: 'Garden' },
    ],
  },
  { value: 'books', label: 'Books' },
  { value: 'sports', label: 'Sports & Outdoors' },
]

// File tree example
const fileTree: SelectraOption[] = [
  {
    value: 'src',
    label: 'src',
    children: [
      {
        value: 'components',
        label: 'components',
        children: [
          { value: 'Button.tsx', label: 'Button.tsx' },
          { value: 'Input.tsx', label: 'Input.tsx' },
          { value: 'Modal.tsx', label: 'Modal.tsx' },
        ],
      },
      {
        value: 'hooks',
        label: 'hooks',
        children: [
          { value: 'useAuth.ts', label: 'useAuth.ts' },
          { value: 'useForm.ts', label: 'useForm.ts' },
        ],
      },
      { value: 'App.tsx', label: 'App.tsx' },
      { value: 'index.ts', label: 'index.ts' },
    ],
  },
  {
    value: 'public',
    label: 'public',
    children: [
      { value: 'index.html', label: 'index.html' },
      { value: 'favicon.ico', label: 'favicon.ico' },
    ],
  },
  { value: 'package.json', label: 'package.json' },
  { value: 'tsconfig.json', label: 'tsconfig.json' },
]

function App() {
  const [basicValue, setBasicValue] = useState<SelectraOption[]>([])
  const [techValue, setTechValue] = useState<SelectraOption[]>([])
  const [countryValue, setCountryValue] = useState<SelectraOption[]>([])
  const [maxValue, setMaxValue] = useState<SelectraOption[]>([])
  const [nestedValue, setNestedValue] = useState<SelectraOption[]>([])
  const [fileValue, setFileValue] = useState<SelectraOption[]>([])

  return (
    <div className="app">
      <header className="hero">
        <h1>Selectra</h1>
        <p>
          A powerful, searchable multi-select dropdown component with tag support for React
        </p>
        <p className="author">Made with <span className="heart">♥</span> by <strong>Sayed Abdul Karim</strong></p>
        <div className="badges">
          <span className="badge">TypeScript</span>
          <span className="badge">Accessible</span>
          <span className="badge">Customizable</span>
          <span className="badge">Lightweight</span>
        </div>
      </header>

      <main className="container">
        <div className="install-section">
          <h3>Installation</h3>
          <pre>
            <code>npm install selectra-react</code>
          </pre>
        </div>

        <div className="card">
          <h2>Basic Usage</h2>
          <p>A simple multi-select dropdown with search functionality.</p>

          <div className="demo-grid">
            <div className="demo-item">
              <label>Select your favorite fruits</label>
              <Selectra
                options={fruits}
                value={basicValue}
                onChange={setBasicValue}
                placeholder="Choose fruits..."
                searchPlaceholder="Type to search..."
              />
              <div className="selected-values">
                Selected: <code>{JSON.stringify(basicValue.map(v => v.value))}</code>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Nested Dropdown</h2>
          <p>Hierarchical options with expandable parent nodes. Click arrows or use Arrow keys to expand/collapse.</p>

          <div className="demo-grid">
            <div className="demo-item">
              <label>Select product categories</label>
              <Selectra
                options={categories}
                value={nestedValue}
                onChange={setNestedValue}
                placeholder="Choose categories..."
                nested
                expandAllByDefault
              />
              <div className="selected-values">
                Selected: <code>{JSON.stringify(nestedValue.map(v => v.value))}</code>
              </div>
            </div>

            <div className="demo-item">
              <label>Select files (tree structure)</label>
              <Selectra
                options={fileTree}
                value={fileValue}
                onChange={setFileValue}
                placeholder="Choose files..."
                nested
              />
              <div className="selected-values">
                Selected: <code>{JSON.stringify(fileValue.map(v => v.value))}</code>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Grouped Options</h2>
          <p>Options can be organized into groups for better organization.</p>

          <div className="demo-grid">
            <div className="demo-item">
              <label>Build your tech stack</label>
              <Selectra
                options={techStack}
                value={techValue}
                onChange={setTechValue}
                placeholder="Select technologies..."
                groupBy
              />
              <div className="selected-values">
                Selected: <code>{JSON.stringify(techValue.map(v => v.value))}</code>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>With Disabled Options</h2>
          <p>Individual options can be disabled to prevent selection.</p>

          <div className="demo-grid">
            <div className="demo-item">
              <label>Select countries (Mexico is disabled)</label>
              <Selectra
                options={countries}
                value={countryValue}
                onChange={setCountryValue}
                placeholder="Select countries..."
              />
              <div className="selected-values">
                Selected: <code>{JSON.stringify(countryValue.map(v => v.value))}</code>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Maximum Selection Limit</h2>
          <p>Limit the number of selections users can make.</p>

          <div className="demo-grid">
            <div className="demo-item">
              <label>Select up to 3 fruits</label>
              <span className="description">Maximum 3 selections allowed</span>
              <Selectra
                options={fruits}
                value={maxValue}
                onChange={setMaxValue}
                placeholder="Choose up to 3..."
                maxSelected={3}
              />
              <div className="selected-values">
                Selected ({maxValue.length}/3): <code>{JSON.stringify(maxValue.map(v => v.value))}</code>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Disabled State</h2>
          <p>The entire component can be disabled.</p>

          <div className="demo-grid">
            <div className="demo-item">
              <label>Disabled dropdown</label>
              <Selectra
                options={fruits}
                defaultValue={[fruits[0], fruits[2]]}
                placeholder="This is disabled..."
                disabled
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2>API Reference</h2>
          <p>All available props for the Selectra component.</p>

          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['options', 'SelectraOption[]', 'required', 'Array of options to display'],
                  ['value', 'SelectraOption[]', '-', 'Controlled selected values'],
                  ['defaultValue', 'SelectraOption[]', '[]', 'Initial selected values'],
                  ['onChange', '(selected) => void', '-', 'Called when selection changes'],
                  ['placeholder', 'string', '"Select..."', 'Placeholder text'],
                  ['searchable', 'boolean', 'true', 'Enable search input'],
                  ['clearable', 'boolean', 'true', 'Show clear all button'],
                  ['disabled', 'boolean', 'false', 'Disable the component'],
                  ['loading', 'boolean', 'false', 'Show loading state'],
                  ['maxSelected', 'number', '-', 'Maximum selections allowed'],
                  ['groupBy', 'boolean', 'false', 'Group options by group property'],
                  ['nested', 'boolean', 'false', 'Enable nested/hierarchical options'],
                  ['expandAllByDefault', 'boolean', 'false', 'Expand all nested options initially'],
                  ['defaultExpandedKeys', 'string[]', '[]', 'Keys of options to expand by default'],
                  ['closeOnSelect', 'boolean', 'false', 'Close dropdown after selection'],
                ].map(([prop, type, defaultVal, desc]) => (
                  <tr key={prop}>
                    <td>{prop}</td>
                    <td>{type}</td>
                    <td>{defaultVal}</td>
                    <td>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>
          Made with React + TypeScript | <a href="https://github.com/saykarim/selectra-react" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="https://www.npmjs.com/package/selectra-react" target="_blank" rel="noopener noreferrer">npm</a>
        </p>
      </footer>
    </div>
  )
}

export default App
