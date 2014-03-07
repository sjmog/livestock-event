EmberAuthRailsDemo::Application.routes.draw do
  

  get "buttons/index"
  get "buttons/new"
  get "buttons/show"
  get "buttons/edit"
  get "buttons/update"
  get "buttons/create"
  get "buttons/destroy"
  devise_for :administrators, :controllers => {:sessions => "adminsessions"}

  mount RailsAdmin::Engine => '/backoffice', :as => 'rails_admin'
  class FormatTest
    attr_accessor :mime_type

    def initialize(format)
      @mime_type = Mime::Type.lookup_by_extension(format)
    end

    def matches?(request)
      request.format == mime_type
    end
  end
  
#stripe

post 'charges' => 'charges#create'
  
#the API

  namespace :api do
    resources :posts, only: [:index, :show]
    resources :stands
    resources :users
    resources :articles
    resources :bookings
    resources :orders
    resources :testimonials
    resources :contractors
    resources :supporters
    resources :exhibitors
    resources :raforms
    resources :hsforms
    resources :showforms
    resources :hazards
    resources :staff_members
    get 'site_contents/:id' => 'site_content#fetch'
    get 'contact' => 'contact#new'
    post 'contact' => 'contact#create'
    post 'session' => 'session#create'
    get 'social_ts' => 'social#social_ts'
    get 'social_fs' => 'social#social_fs'
    get 'social_ls' => 'social#social_ls'
  end

  #the Admin area

  namespace :admin do
      resources :tiles
      resources :tabs
      resources :posts
      resources :stands
      resources :users
      resources :articles
      resources :bookings
      resources :orders
      resources :testimonials
      resources :contractors
      resources :supporters
      resources :exhibitors
      resources :raforms
      resources :hsforms
      resources :showforms
      resources :hazards
      resources :staff_members
      #fix simple_form's updating (which goes via POST instead of PUT for some reason)
      post 'posts/:id' => 'posts#update'
      post 'stands/:id' => 'stands#update'
      post 'users/:id' => 'users#update'
      post 'articles/:id' => 'articles#update'
      post 'bookings/:id' => 'bookings#update'
      post 'orders/:id' => 'orders#update'
      post 'testimonials/:id' => 'testimonials#update'
      post 'contractors/:id' => 'contractors#update'
      post 'supporters/:id' => 'supporters#update'
      post 'tiles/:id' => 'tiles#update'
      post 'tabs/:id' => 'tabs#update'
      post 'buttons/:id' => 'buttons#update'
      post 'session' => 'session#create'
      post 'exhibitors/:id' => 'exhibitors#update'
      post 'raforms/:id' => 'raforms#update'
      post 'hsforms/:id' => 'hsforms#update'
      post 'showforms/:id' => 'showforms#update'
      post 'site_contents/:id' => 'site_content#update', as: :site_content
      patch 'site_contents/:id' => 'site_content#update'
      post 'staff_members/:id' => 'staff_members#update'

      #printing
      get '/bookings/:id/print', to: 'bookings#print', as: :print_booking
      get '/raforms/:id/print', to: 'print#print_raform', as: :print_raform
      get '/hsforms/:id/print', to: 'print#print_hsform', as: :print_hsform
      get '/showforms/:id/print', to: 'print#print_showform', as: :print_showform
  
      #verifications
      get '/raforms/:id/verify', to: 'verifications#verify_raform', as: :verify_raform
      get '/hsforms/:id/verify', to: 'verifications#verify_hsform', as: :verify_hsform
      get '/showforms/:id/verify', to: 'verifications#verify_showform', as: :verify_showform

      #notifications
      get '/notifications', to: 'notifications#index'
      get '/notifications/:id', to: 'notifications#show'

      # building exhibitors

      get '/build-exhibitors', :to => 'bookings#build_exhibitors'

      # building forms

      get '/build-forms', :to => 'bookings#build_forms'

      #cms

      get '/site_contents/:name', :to => 'site_content#fetch', as: :fetch_content
  end


  root to: 'home#index'

  get '/', :to => 'home#index', :constraints => FormatTest.new(:html)

  get '/paid', :to => 'backends#sagepay_return'

  get '/admin', :to => 'admin#main', as: :admin_main

  get '/admin/home/:token', :to => 'admin#main'

  get '/admin/login', :to => 'admin#login'

  post '/admin/search', :to => 'admin#search'

  get '/admin/search', :to => 'admin#search', as: :admin_search_results

  get '/*foo', :to => 'home#index', :constraints => FormatTest.new(:html)






  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
