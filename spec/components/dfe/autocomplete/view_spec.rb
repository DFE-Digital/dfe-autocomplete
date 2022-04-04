module Dfe
  module Autocomplete
    class ExampleModel
      include ActiveModel::Model
      attr_accessor :id, :country, :country_raw
    end

    class ExampleModelTwo
      include ActiveModel::Model
      attr_accessor :id, :grade
    end

    describe View do
      let(:controller) { ActionController::Base.new }
      include ActionView::Helpers::FormHelper
      alias_method :component, :page

      context 'when sending classes to parent container' do
        before do
          render_inline(
            View.new(form, attribute_name: :country, form_field: form_field, classes: 'test-css-class')
          )
        end

        it 'supports custom classes on the parent container' do
          expect(component).to have_selector('.test-css-class')
        end
      end

      context 'when sending html attributes' do
        before do
          render_inline(
            View.new(
              form,
              attribute_name: :country,
              form_field: form_field,
              html_attributes: { 'test-attribute' => 'my-custom-attribute' }
            )
          )
        end

        it 'supports custom html attributes on the parent container' do
          expect(component).to have_selector('[test-attribute="my-custom-attribute"]')
        end
      end

      context 'when not defining the raw attribute' do
        before do
          render_inline(
            View.new(
              form(ExampleModelTwo),
              attribute_name: :grade,
              form_field: form_field,
              html_attributes: { 'test-attribute' => 'my-custom-attribute' }
            )
          )
        end

        it 'supports custom html attributes on the parent container' do
          expect(component).to have_selector('[data-default-value=""]')
        end
      end

      private

      attr_accessor :output_buffer

      def form_field
        <<~EOSQL
          <div class="govuk-form-group">
            <label class="govuk-label" for="select-1">
              Select a country
            </label>
            <select class="govuk-select" id="select-1" name="select-1">
              <option value="">Select a country</option>
              <option value="fr">France</option>
              <option value="de">Germany</option>
              <option value="gb">United Kingdom</option>
            </select>
          </div>
        EOSQL
      end

      def form(model = ExampleModel)
        form_for model.new, url: 'example.com' do |f|
          return f
        end
      end
    end
  end
end
