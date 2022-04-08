RSpec.describe Dfe::Autocomplete::ApplicationHelper, type: :helper do
  describe '#dfe_autocomplete_options' do
    context 'when appending values into the suggestions' do
      it 'adds the data append attribute' do
        records = [
          double(name: 'Bachelor of Arts Economics', abbreviation: 'BAEcon')
        ]
        expect(helper.dfe_autocomplete_options(records, append: :abbreviation)).to eq(
          [
            [nil, nil, nil],
            ['Bachelor of Arts Economics', 'Bachelor of Arts Economics',
             { 'data-append' => '<strong>(BAEcon)</strong>', 'data-boost' => 1.5, 'data-synonyms' => '' }]
          ]
        )
      end
    end

    context 'when records have synonyms' do
      context 'when using the synonyms fields' do
        it 'returns the name and the synonyms data' do
          records = [
            double(name: 'A', synonyms: ['a', 'an a'])
          ]
          expect(helper.dfe_autocomplete_options(records)).to eq(
            [
              [nil, nil, nil],
              ['A', 'A', { 'data-append' => nil, 'data-boost' => 1.5, 'data-synonyms' => 'a|an a' }]
            ]
          )
        end
      end

      context 'when using other synonyms fields' do
        it 'returns the name and the synonyms data' do
          records = [
            double(
              name: 'University of Oxford',
              suggestion_synonyms: ['Westminster College'],
              match_synonyms: [
                'The University of Oxford',
                'The Chancellor, Masters and Scholars of the University of Oxford'
              ]
            )
          ]
          expect(helper.dfe_autocomplete_options(records,
                                                 synonyms_fields: %i[suggestion_synonyms match_synonyms])).to eq(
                                                   [
                                                     [nil, nil, nil],
                                                     ['University of Oxford', 'University of Oxford',
                                                      { 'data-append' => nil, 'data-boost' => 1.5, 'data-synonyms' => 'Westminster College|The University of Oxford|The Chancellor, Masters and Scholars of the University of Oxford' }]
                                                   ]
                                                 )
        end
      end
    end
  end
end
