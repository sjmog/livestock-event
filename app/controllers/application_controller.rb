class ApplicationController < ActionController::Base
  include ActionController::MimeResponds
  include ActionController::ImplicitRender

  before_filter do
    resource = controller_name.singularize.to_sym
    method = "#{resource}_params"
    params[resource] &&= send(method) if respond_to?(method, true)
  end

  protected

  # Renders a 401 status code if the current user or admin is not authorized
  def ensure_authenticated_user
    head :unauthorized unless current_user || current_admin
  end

  rescue_from CanCan::AccessDenied do |exception|
    render :file => "#{Rails.root}/public/403.html", :status => 403, :layout => false
    ## to avoid deprecation warnings with Rails 3.2.x (and incidentally using Ruby 1.9.3 hash syntax)
    ## this render call should be:
    # render file: "#{Rails.root}/public/403", formats: [:html], status: 403, layout: false
  end

  # Returns the active user associated with the access token if available
  def current_user
    api_key = ApiKey.active.where(access_token: token).first
    if api_key
      return api_key.user
    else
      return nil
    end
  end
   
    # Finds the User with the ID stored in the session with the key
    # :current_user_id This is a common way to handle user login in
    # a Rails application; logging in sets the session value and
    # logging out removes it.
    def current_admin
      @_current_admin ||= session[:current_admin_id] &&
        Administrator.find_by_id(session[:current_admin_id])
    end

  # Parses the access token from the header
  def token
    bearer = request.headers["HTTP_AUTHORIZATION"]

    # allows our tests to pass
    bearer ||= request.headers["rack.session"].try(:[], 'Authorization')

    if bearer.present?
      bearer.split.last
    else
      nil
    end
  end




end