Rails.application.routes.draw do
  root 'timesheets#new'

  resources :timesheets, except: [:show] do
    get '/:yyyymm', action: :index, on: :collection, yyyymm: /[0-9]{6}/
  end
end
