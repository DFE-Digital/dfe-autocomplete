module Dfe
  module Autocomplete
    module ApplicationHelper
      def dfe_autocomplete_options(records, synonyms_fields: [:synonyms], append: false, boost: 1.5)
        records.sort_by(&:name).map do |record|
          data = {
            'data-synonyms' => synonyms_for(record, synonyms_fields).flatten.join('|'),
            'data-boost' => boost
          }

          append_data = record.send(append) if append.present?
          data['data-append'] = append_data && tag.strong("(#{append_data})")

          [record.name, record.name, data]
        end.unshift([nil, nil, nil])
      end

      private

      def synonyms_for(record, synonyms_fields)
        synonyms = []

        synonyms_fields.each do |synonym_field|
          synonyms << record.send(synonym_field) if record.respond_to?(synonym_field)
        end

        synonyms
      end
    end
  end
end
