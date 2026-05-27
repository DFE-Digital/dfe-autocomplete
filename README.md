# DfE Autocomplete

An accessible autocomplete library for the Department for Education, built on top of [accessible-autocomplete](https://github.com/alphagov/accessible-autocomplete). Adds intelligent sorting with synonym matching, stop word filtering, and weighted scoring.

## 5-minute quickstart

### 1. Install

**Ruby (Gemfile):**
```ruby
gem 'dfe-autocomplete', require: 'dfe/autocomplete', github: 'DFE-Digital/dfe-autocomplete'
```

**JavaScript (package.json):**
```json
{
  "dependencies": {
    "dfe-autocomplete": "github:DFE-Digital/dfe-autocomplete"
  }
}
```

### 2. Add HTML

```html
<div data-module="app-dfe-autocomplete">
  <div class="govuk-form-group">
    <select name="subject" id="subject">
      <option value="">Select a subject</option>
      <option value="1">Mathematics</option>
      <option value="2">English Literature</option>
      <option value="3">Physics</option>
    </select>
  </div>
</div>
```

### 3. Initialize

```javascript
import dfeAutocomplete from 'dfe-autocomplete'

dfeAutocomplete()
```

### 4. Import styles

```scss
@forward "dfe-autocomplete/src/dfe-autocomplete";
```

That's it. The select element is enhanced into a searchable autocomplete.

---

## Data attributes

Enrich options with data attributes for better search and display:

```html
<option value="1"
  data-synonyms="maths|math|numeracy"
  data-append="(MATH101)"
  data-hint="Core subject"
  data-boost="1.5">
  Mathematics
</option>
```

| Attribute | What it does | Example |
|-----------|-------------|---------|
| `data-synonyms` | Alternative search terms, pipe-separated | `"maths\|math\|numeracy"` |
| `data-append` | Extra text shown after the option name | `"(MATH101)"` |
| `data-hint` | Helper text shown below the option name | `"Core subject"` |
| `data-boost` | Relevance multiplier (default: 1) | `"1.5"` |
| `data-default-value` | Pre-selected value (on the container div) | `"Mathematics"` |
| `data-debug` | Enable console logging (on the container div) | `"true"` |

---

## JavaScript API

### Global initialization

```javascript
import dfeAutocomplete from 'dfe-autocomplete'

// Initialize all elements with data-module="app-dfe-autocomplete"
dfeAutocomplete()

// With options (applied to all instances)
dfeAutocomplete({ minLength: 2, autoselect: false })
```

### Individual element setup

```javascript
import { dfeAutocompleteField } from 'dfe-autocomplete'

const instance = dfeAutocompleteField(element, {
  minLength: 2,
  autoselect: false,
  rawAttribute: true,
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minLength` | number | `1` | Minimum characters before suggestions appear |
| `autoselect` | boolean | `true` | Auto-select first result |
| `rawAttribute` | boolean | `false` | Append `_raw` to field name for free-text entry |
| `name` | string | — | Override the input field name |
| `tracker` | object | — | Object with `trackSearch(query)` and `sendTrackingEvent(value, name)` |
| `maxResults` | number | `Infinity` | Limit number of displayed results |
| `showAllOnFocus` | boolean | `false` | Show all options when input is focused |
| `highlightMatches` | boolean | `false` | Bold matching text in suggestions |
| `confirmOnBlur` | boolean | `true` | Confirm selection when input loses focus |
| `displayMenu` | string | `'inline'` | Menu display mode (`'inline'` or `'overlay'`) |

All [accessible-autocomplete options](https://github.com/alphagov/accessible-autocomplete#api-documentation) are also supported and passed through.

### Instance methods

```javascript
const instance = dfeAutocompleteField(element, options)

instance.getValue()          // Get current input value
instance.setValue('London')  // Set input value
instance.destroy()           // Remove autocomplete, restore native select
```

---

## Events

```javascript
const instance = dfeAutocompleteField(element)

instance.on('search', ({ query, results }) => {
  console.log(`Searched "${query}", found ${results.length} results`)
})

instance.on('select', ({ value }) => {
  document.getElementById('display').textContent = value
})

instance.on('destroy', () => {
  console.log('Autocomplete removed')
})

// Unsubscribe
const unsubscribe = instance.on('search', handler)
unsubscribe()

// Or use off()
instance.off('search', handler)
```

| Event | When | Data |
|-------|------|------|
| `search` | After search results are computed | `{ query, results }` |
| `select` | User picks an option | `{ value }` |
| `destroy` | Instance is cleaned up | — |
| `loading` | Async source starts/finishes loading | `{ loading: boolean }` |
| `error` | Async source encounters an error | `{ error }` |

---

## Custom sort and scoring

### Custom stop words

```javascript
dfeAutocompleteField(element, {
  stopWords: ['the', 'of', 'and', 'university', 'college', 'school'],
})
```

### Custom scoring function

```javascript
dfeAutocompleteField(element, {
  calculateWeight: (option, query) => {
    if (option.name === query) return 100
    if (option.name.startsWith(query)) return 60
    return 0
  }
})
```

### Custom text cleaning

```javascript
dfeAutocompleteField(element, {
  clean: (text) => text.trim().toLowerCase(), // preserves accents
})
```

### Replace entire sort pipeline

```javascript
dfeAutocompleteField(element, {
  sort: (query, options) => {
    return options
      .filter(o => o.name.toLowerCase().includes(query.toLowerCase()))
  }
})
```

---

## Async / remote data source

### Function mode

```javascript
dfeAutocompleteField(element, {
  source: async (query) => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    return res.json() // [{ name: 'London', append: '(LON)' }, ...]
  }
})
```

### Declarative URL mode

```javascript
dfeAutocompleteField(element, {
  source: {
    url: '/api/search',
    queryParam: 'q',
    debounce: 300,
    transform: (data) => data.results,
  }
})
```

---

## Search index (large datasets)

For 1000+ options, enable the inverted index for faster candidate lookup:

```javascript
dfeAutocompleteField(element, {
  useSearchIndex: true,
  maxResults: 20,
})
```

---

## Plugin system

```javascript
import dfeAutocomplete from 'dfe-autocomplete'

// Global plugin — applies to all instances
dfeAutocomplete.use({
  name: 'analytics',
  onSearch: ({ query, results }) => {
    analytics.track('search', { query, count: results.length })
  },
  onSelect: ({ value }) => {
    analytics.track('select', { value })
  }
})

// Per-instance plugin
dfeAutocompleteField(element, {
  plugins: [{
    name: 'logger',
    onInitialize: ({ options }) => console.log('Options:', options.length),
    onDestroy: () => console.log('Destroyed'),
  }]
})
```

| Hook | When | Data |
|------|------|------|
| `onInitialize` | After setup | `{ element, options }` |
| `onSearch` | After search | `{ query, results }` |
| `onSelect` | User picks an option | `{ value }` |
| `onDestroy` | Instance cleanup | — |

---

## Engine abstraction

Swap the underlying autocomplete library:

```javascript
import { setEngine, BaseEngine } from 'dfe-autocomplete'

class CustomEngine extends BaseEngine {
  initialize() { /* render custom autocomplete */ }
  destroy() { /* cleanup */ }
  getValue() { return this.element.querySelector('input')?.value || '' }
  setValue(value) { this.element.querySelector('input').value = value }
}

setEngine(CustomEngine)
```

---

## Stimulus controller

For Hotwire/Turbo applications:

```html
<div data-controller="dfe-autocomplete"
     data-dfe-autocomplete-min-length-value="2"
     data-dfe-autocomplete-show-all-on-focus-value="true">
  <div class="govuk-form-group">
    <select name="subject">...</select>
  </div>
</div>
```

```javascript
import { Application } from '@hotwired/stimulus'
import { DfeAutocompleteController } from 'dfe-autocomplete/src/stimulus/dfe-autocomplete-controller'

const app = Application.start()
app.register('dfe-autocomplete', DfeAutocompleteController)
```

Supported values: `min-length`, `autoselect`, `raw-attribute`, `show-all-on-focus`, `max-results`, `highlight-matches`.

---

## CSS custom properties

Override styling without modifying the source:

```css
:root {
  --dfe-autocomplete-border-color: #1d70b8;
  --dfe-autocomplete-menu-max-height: 400px;
  --dfe-autocomplete-menu-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

---

## Debug mode

Enable console logging per-element:

```erb
<div data-module="app-dfe-autocomplete"
     data-debug="<%= Rails.env.local? %>">
  <%= form_field %>
</div>
```

Logs initialization, search queries with result counts, and selections.

---

## Rails usage

### Helper

```ruby
module ApplicationHelper
  include DfE::Autocomplete::ApplicationHelper
end
```

### View component

```erb
<%= render DfE::Autocomplete::View.new(
  f,
  attribute_name: :institution_name,
  form_field: f.govuk_select(
    :institution_name,
    options_for_select(
      dfe_autocomplete_options(@institutions, synonyms_fields: %i[synonyms match_synonyms]),
      f.object.institution_name,
    ),
  )
) %>
```

The `dfe_autocomplete_options` helper assumes collection elements respond to `name`. Optional methods: `value` (option value), `synonyms` (auto-included). Additional synonym fields can be passed via `synonyms_fields`. Use `append` for extra display text and `boost` for relevance multiplier.

### Inflections

If you get `NameError: uninitialized constant Dfe::Autocomplete::View`, add to `config/initializers/inflections.rb`:

```ruby
ActiveSupport::Inflector.inflections(:en) do |inflect|
  inflect.acronym "DfE"
end
```

---

## Contributing

```bash
npm install
npm test          # Run tests
npm run compile   # Build dist/
```

## Licence

[MIT](MIT-LICENSE).
