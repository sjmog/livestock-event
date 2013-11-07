EmberAuthRailsDemo::Application.routes.draw do
  
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
    resources :users #, except: [:new, :edit, :destroy], :constraints => FormatTest.new(:json)
    resources :articles
    resources :bookings
    resources :orders
    resources :testimonials
    resources :contractors
    resources :supporters
    get 'contact' => 'contact#new'
    post 'contact' => 'contact#create'
    post 'session' => 'session#create'
  end


  root to: 'home#index'

  get '*foo', :to => 'home#index', :constraints => FormatTest.new(:html)
  get '/', :to => 'home#index', :constraints => FormatTest.new(:html)

  get '/paid', :to => 'backends#sagepay_return'


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
