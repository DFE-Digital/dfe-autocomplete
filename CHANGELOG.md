## v0.2.0

* Updates the target version of node to the latest LTS version
* Updates accessible-autocomplete and the devDependencies to their latest versions
* replaces uglifyjs-webpack-plugin (which is no longer maintained) with terser-webpack-plugin
* replaces @babel/plugin-proposal-class-properties with its replacement @babel/plugin-transform-class-properties
* removes node-sass (the repo already has sass so I don't think this is needed)
* removes csso-cli (couldn't find any uses of this or documentation)
* removes webpack-dev-server (couldn't find any uses of this or documentation)
* Expose individual setup of specific elements (example via Stimulus):
    ```
    import { Controller } from '@hotwired/stimulus'
    import { dfeAutocompleteField } from 'dfe-autocomplete';

     export default class extends Controller {
       connect() {
         dfeAutocompleteField(this.element, {
           minLength: 2,
         })
       }
    }
    ```
* Fix name accessible autocomplete overwrite: Now you pass name: as option to the autocomplete
and will work as expected.

## v0.1.0

* First release of the rubygem and the npm package
