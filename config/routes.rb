Rails.application.routes.draw do
  root 'timesheets#new'

  resources :timesheets
end
