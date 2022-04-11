require 'active_model'
require 'govuk/components'
require 'govuk/components/engine'

module DfE
  module Autocomplete
    class Engine < ::Rails::Engine
      isolate_namespace DfE::Autocomplete

      config.to_prepare do
        Dir[
          DfE::Autocomplete::Engine.root.join('app', 'components', '*/*/*.rb'),
        ].sort.each { |f| require_dependency f }
      end

      initializer 'local_helper.action_controller' do
        require_dependency DfE::Autocomplete::Engine.root.join('app', 'helpers', 'dfe', 'autocomplete', 'application_helper.rb')
        ActiveSupport.on_load :action_controller_base do
          helper DfE::Autocomplete::ApplicationHelper
        end
      end
    end
  end
end
