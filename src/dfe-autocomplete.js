import accessibleAutocomplete from 'accessible-autocomplete'
import { nodeListForEach } from 'govuk-frontend/govuk/common'
import sort from './sort'

let minLength;
let tracker;

const nullTracker = {
  sendTrackingEvent: function() { },
  trackSearch: function() { }
}

const defaultValueOption = component => component.getAttribute('data-default-value') || ''

const suggestion = (value, options) => {
  const option = options.find(o => o.name === value)
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
    boost: (parseFloat(option.getAttribute('data-boost')) || 1)
  }
}

const setupAccessibleAutoComplete = (component, libraryOptions = {}) => {
  const selectEl = component.querySelector('select')
  const selectOptions = Array.from(selectEl.options)
  const options = selectOptions.map(o => enhanceOption(o))
  const inError = component.querySelector('div.govuk-form-group').className.includes('error')
  const inputValue = defaultValueOption(component)
  tracker = libraryOptions.trackerObject || nullTracker;
  minLength = libraryOptions.minLength || 1;
  const rawAttribute = libraryOptions.rawAttribute || false;

  // We add a name which we base off the name for the select element and add "raw" to it, eg
  // if there is a select input called "course_details[subject]" we add a name to the text input
  // as "course_details[subject_raw]"
  const matches = /^(\w+)\[(\w+)\]$/.exec(selectEl.name)
  let fieldName = `${matches[1]}[${matches[2]}]`

  if (rawAttribute) {
    fieldName = `${matches[1]}[${matches[2]}_raw]`
  }

  accessibleAutocomplete.enhanceSelectElement({
    defaultValue: inError ? '' : inputValue,
    selectElement: selectEl,
    minLength: minLength,
    source: (query, populateResults) => {
      if (/\S/.test(query)) {
        tracker.trackSearch(query)
        populateResults(sort(query, options))
      }
    },
    autoselect: true,
    templates: { suggestion: (value) => suggestion(value, options) },
    name: fieldName,
    onConfirm: (val) => {
      tracker.sendTrackingEvent(val, selectEl.name)
      const selectedOption = [].filter.call(selectOptions, option => (option.textContent || option.innerText) === val)[0]
      if (selectedOption) selectedOption.selected = true
    }
  })

  if (inError) {
    component.querySelector('input').value = inputValue
  }
}

const setupDfEAutoComplete = (libraryOptions = {}) => {
  const $allAutocompleteElements = document.querySelectorAll('[data-module="app-dfe-autocomplete"]')

  $allAutocompleteElements.forEach((element) => {
    setupAccessibleAutoComplete(element, libraryOptions)
  });
}

setupDfEAutoComplete();
