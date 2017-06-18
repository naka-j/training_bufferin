Rails.application.routes.draw do
  root 'timesheets#new'

  resources :timesheets, except: [:show, :edit, :update] do
    get '/:yyyymm', action: :index, on: :collection, yyyymm: /[0-9]{6}/
    get '/:dd/edit', action: :edit, on: :member, id: /[0-9]{6}/, dd: /[0-9]{2}/
    patch '/:dd', action: :update, on: :member, id: /[0-9]{6}/, dd: /[0-9]{2}/
    delete '/:dd', action: :destroy, on: :member, id: /[0-9]{6}/, dd: /[0-9]{2}/
  end

  mount ActionCable.server => '/cable'
end
