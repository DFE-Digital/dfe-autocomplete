import accessibleAutocomplete from 'accessible-autocomplete'
import sort from './sort'

let minLength;
let tracker;

const nullTracker = {
  sendTrackingEvent: function() { },
  trackSearch: function() { }
}

const defaultValueOption = component => component.getAttribute('data-default-value') || ''

const suggestion = (value, options) => {
  const option = options.find(o => o.name === value || o.text == value )
  if (option) {
    const html = option.append ? `<span>${value}</span> ${option.append}` : `<span>${value}</span>`
    return option.hint ? `${html}<br>${option.hint}` : html
  } else {
    return `<span>No results found</span>`
  }
}

const enhanceOption = (option) => {
  return {
    name: option.label,
    synonyms: (option.getAttribute('data-synonyms') ? option.getAttribute('data-synonyms').split('|') : []),
    append: option.getAttribute('data-append'),
    hint: option.getAttribute('data-hint'),
    boost: (parseFloat(option.getAttribute('data-boost')) || 1),
    text: option.textContent || option.innerText
  }
}

export const setupAccessibleAutoComplete = (component, libraryOptions = {}) => {
  const selectEl = component.querySelector('select')
  const selectOptions = Array.from(selectEl.options)
  const options = selectOptions.map(o => enhanceOption(o))
  const inError = component.querySelector('div.govuk-form-group').className.includes('error')
  const inputValue = defaultValueOption(component)
  const tracker = libraryOptions.tracker || nullTracker
  const limitResults = libraryOptions.limitResults || null

  const defaultOptions = {
    autoselect: true,
    defaultValue: inError ? '' : inputValue,
    minLength: 1,
    rawAttribute: false,
    selectElement: selectEl,
    trackerObject: tracker,
    onConfirm: (val) => {
      tracker.sendTrackingEvent(val, selectEl.name)
      const selectedOption = [].filter.call(selectOptions, option => (option.textContent || option.innerText) === val)[0]
      if (selectedOption) selectedOption.selected = true
    },
    source: (query, populateResults) => {
      if (/\S/.test(query)) {
        tracker.trackSearch(query)

        let results = sort(query, options)

        if (limitResults) {
          results = results.slice(0, limitResults)
        }

        populateResults(results)
      }
    },
    templates: { suggestion: (value) => suggestion(value, options) }
  }

  const autocompleteOptions = Object.assign({}, defaultOptions, libraryOptions);
  autocompleteOptions.name = generateNameFromSelect(selectEl, libraryOptions);

  accessibleAutocomplete.enhanceSelectElement(autocompleteOptions)

  if (inError) {
    component.querySelector('input').value = inputValue
  }
}

// Generate the correct name for the autocomplete field
//
// Scenario 1: If a 'name' is explicitly passed in the options, use it directly
// This scenario bypasses the rest of the logic and assigns the 'name' passed in the options.
// Example: libraryOptions.name = 'some_value'
//
// Scenario 2: If no 'name' is passed, apply regex logic based on the 'select' element's name.
// The regex looks for the format 'course_details[subject]' and splits it into two parts.
// Example: selectEl.name = 'course_details[subject]'
//
// Scenario 2.1: If 'rawAttribute' is true, append '_raw' to the second part of the name.
// Example: selectEl.name = 'course_details[subject]' and libraryOptions.rawAttribute = true
// Result: 'course_details[subject_raw]'
//
// Scenario 2.2: If 'rawAttribute' is false (or not specified), keep the name as it is.
// Example: selectEl.name = 'course_details[subject]' and libraryOptions.rawAttribute = false
// Result: 'course_details[subject]'
//
// Scenario 3: If no match is found from the regex, return the original 'select' element's name.
// Example: selectEl.name = 'subject'
// Result: 'subject'
//
function generateNameFromSelect(selectEl, libraryOptions) {
  if (libraryOptions.name) {
    return libraryOptions.name;
  }

  const matches = /^(\w+)\[(\w+)\]$/.exec(selectEl.name);

  if (matches) {
    if (libraryOptions.rawAttribute) {
      return `${matches[1]}[${matches[2]}_raw]`;
    } else {
      return `${matches[1]}[${matches[2]}]`;
    }
  } else {
    return selectEl.name;
  }
}
