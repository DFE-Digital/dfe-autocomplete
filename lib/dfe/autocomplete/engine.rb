require 'active_model'
require 'govuk/components'
require 'govuk/components/engine'

module Dfe
  module Autocomplete
    class Engine < ::Rails::Engine
      isolate_namespace Dfe::Autocomplete

      config.to_prepare do
        Dir[
          Dfe::Autocomplete::Engine.root.join("app", "components", "*/*/*.rb")
        ].sort.each { |f| require_dependency f }
      end
    end
  end
end

