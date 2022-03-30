Rails.application.routes.draw do
  mount Dfe::Autocomplete::Engine => '/dfe-autocomplete'
end
