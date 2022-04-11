require 'active_model'
require 'govuk/components'
require 'govuk/components/engine'

module Dfe
  module Autocomplete
    class Engine < ::Rails::Engine
      isolate_namespace Dfe::Autocomplete

      config.to_prepare do
        Dir[
          Dfe::Autocomplete::Engine.root.join('app', 'components', '*/*/*.rb'),
        ].sort.each { |f| require_dependency f }
      end

      initializer 'local_helper.action_controller' do
        require_dependency Dfe::Autocomplete::Engine.root.join('app', 'helpers', 'dfe', 'autocomplete', 'application_helper.rb')
        ActiveSupport.on_load :action_controller_base do
          helper Dfe::Autocomplete::ApplicationHelper
        end
      end
    end
  end
end
