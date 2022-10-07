# DfE::Autocomplete

A library built on top of accessible-autocomplete from GovUk.

It can benefit more if you have a rich data where you can match the autocomplete
results with synonyms and also ignoring stopwords so it can benefit for more
accuracy.

## Usage

## Ruby Installation

Add this line to your application's Gemfile (currently not on Rubygems yet):

```ruby
gem 'dfe-autocomplete', require: 'dfe/autocomplete', github: 'DFE-Digital/dfe-autocomplete'
```

And then execute:

```bash
$ bundle
```

### Inflections

You might get an error when running tests in CI that looks like this:

```ruby
NameError: uninitialized constant Dfe::Autocomplete::View
```

Note the `Dfe` which is incorrectly capitalised. This is likely related to the
inflector.

One way to fix it is to specify a new acronym in an initializer, e.g. in
`config/initializers/inflections.rb`:

```ruby
ActiveSupport::Inflector.inflections(:en) do |inflect|
  inflect.acronym "DfE"
end
```

## NPM package

Add this line to your application's package.json (currently not on NPM yet):

```json
{
  "dependencies": {
    "dfe-autocomplete": "github:DFE-Digital/dfe-autocomplete"
  }
}
```

## Rails usage

An example of data of the autocomplete, given we have an object called
`Institution`:

```ruby
  class Institution
    include ActiveModel::Model
    attr_accessor :name, :synonyms, :match_synonyms
  end
```

And the form object to make the user type an institution:

```ruby
  class InstitutionForm
    include ActiveModel::Model
    attr_accessor :institution_name, :institution_name_raw
  end
```

And we have an array of institutions in any controller:

```ruby
  class SomeController < ApplicationController
    def index
      @institution_form = InstitutionForm.new
      @institutions = [
        Institution.new(
          name: 'University of Oxford',
          synonyms: ['Westminster College'],
          match_synonyms: ['The Chancellor, Masters and Scholars of the University of Oxford']
        )
      ]
    end
  end
```

Then the module `DfE::Autocomplete::ApplicationHelper` is included in
application_helper.rb:

```ruby
  module ApplicationHelper
    include DfE::Autocomplete::ApplicationHelper
  end
```

Then we can output the HTML required for the JS to work using the gem component
`DfE::Autocomplete::View` and the gem helper `dfe_autocomplete_options`:

```erb
   <% form_with model: @institution_form do |f| %>
     <%= render DfE::Autocomplete::View.new(
      f,
      attribute_name: :institution_name,
      form_field: f.govuk_select(
        :institution_name,
        options_for_select(
          dfe_autocomplete_options(@institutions, synonyms_fields: %i[suggestion_synonyms match_synonyms]),
          f.object.institution_name,
        ),
      )
    ) %>
  <% end %>
```

The helper `dfe_autocomplete_options` assumes that the elements in the
collection respond to the method `name`. If the element responds to `value`
that will be used as the value of the `<option>` HTML element. If the
element responds to `synonyms` that will be included in the synonyms list
automatically. If you want to pass  other methods that are synonyms you can
include as the example above `suggestion_synonyms match_synonyms`. If you
need to append any data to the results you can use the `append` option.
There is also the boost option.

## Javascript

```javascript
import dfeAutocomplete from "dfe-autocomplete";

dfeAutocomplete({});
```

Supported options:

- `trackerObject`: A tracker object that responds to 'trackSearch' and 'sendTrackingEvent' functions
- `minLength`: The minimum number of characters that should be entered before the autocomplete will attempt to suggest options. When the query length is under this, the aria status region will also provide helpful text to the user informing them they should type in more.
- `rawAttribute`: the second parameter that will be sent when user submits the form. This is useful when the user types free text instead of choosing any element in the collection.

Plus all the other options from the upstream autocomplete: https://github.com/alphagov/accessible-autocomplete#api-documentation

## Stylesheet

You need to import it using Sass:

```scss
@import "dfe-autocomplete/src/dfe-autocomplete";
```

## Contributing

Run the `npm run build` and commit the resulting `dist` folder:

```bash
npm run build
```

## Licence

[MIT](MIT-LICENSE).
