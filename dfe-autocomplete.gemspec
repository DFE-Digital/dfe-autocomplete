require_relative 'lib/dfe/autocomplete/version'

Gem::Specification.new do |spec|
  spec.required_ruby_version = Gem::Requirement.new('>= 2.7.0')
  spec.name        = 'dfe-autocomplete'
  spec.version     = DfE::Autocomplete::VERSION
  spec.authors     = ["Tomas D'Stefano"]
  spec.email       = ['tomas_stefano@successoft.com']
  spec.homepage    = 'https://github.com/DFE-Digital/dfe-autocomplete'
  spec.summary     = 'Features built on top of accessible autocomplete'
  spec.description = 'Autocomplete built on top of accessible autocomplete lib'
  spec.license = 'MIT'

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the "allowed_push_host"
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  # spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"

  spec.metadata['homepage_uri'] = spec.homepage
  spec.metadata['source_code_uri'] = 'https://github.com/DFE-Digital/dfe-autocomplete'
  spec.metadata['changelog_uri'] = 'https://github.com/DFE-Digital/dfe-autocomplete/blob/main/CHANGELOG.md'

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir['{app,config,db,lib}/**/*', 'MIT-LICENSE', 'Rakefile', 'README.md']
  end

  spec.add_dependency 'actionview', '>= 7.0.2.3'
  spec.add_dependency 'activemodel', '>= 7.0.2.3'
  spec.add_dependency 'govuk-components'
  spec.add_dependency 'rails', '>= 7.0.2.3'
  spec.add_dependency 'view_component'
  spec.add_development_dependency 'capybara'
  spec.add_development_dependency 'rspec-html-matchers'
  spec.add_development_dependency 'rspec-rails'
  spec.metadata['rubygems_mfa_required'] = 'true'
end
