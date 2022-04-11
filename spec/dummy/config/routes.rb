Rails.application.routes.draw do
  mount DfE::Autocomplete::Engine => '/dfe-autocomplete'
end
