module Admin
  class BaseController < InheritedResources::Base
    layout "admin"
    respond_to :json
    include CanCan::ControllerAdditions
    include PublicActivity::StoreController 
    
    before_filter do
      :default_json
      resource = controller_name.singularize.to_sym
      method = "#{resource}_params"
      params[resource] &&= send(method) if respond_to?(method, true)
      # ensure_authenticated_user
      retrieve_activities
    end
    def retrieve_activities
      @activities = PublicActivity::Activity.all.order("created_at desc")
    end

    # Redirects to login if admin is not authorized
    def ensure_authenticated_user
      puts session.size
      puts request.session_options[:id]
      puts Rails.application.config.session_options[:key]
      if current_user
        if session[:current_user_role] === "admin"
          puts 'user authenticated admin, redirecting to main'
        else
          puts 'user not an admin, redirecting to login'
          flash[:notice] = "You don't appear to be an administrator."
          redirect_to '/admin/login'
        end
      else

        puts 'user not authenticated, redirecting to login'
        flash[:notice] = "Please sign in as an administrator first."
        redirect_to '/admin/login'
      end
    end

    def collection
      get_collection_ivar || begin
        c = end_of_association_chain
        coll = c.respond_to?(:scoped) ? c.scoped : c
        coll = params[:ids] ? coll.find(params[:ids]) : coll.all
        set_collection_ivar(coll)
      end
    end
    # Parses the access token from the header
      def token
        access_token = request.cookies["access_token"]

        if access_token.present?
          access_token
        else
          nil
        end
      end
       
        # Finds the API key and returns its associated user.
        # Uses the unique request cookie in the header to figure out who the user is
        def current_user
          api_key = ApiKey.active.where(access_token: token).first
          if api_key
            puts api_key.user.id
            if api_key.user.role === "admin"
              return api_key.user
            else
              return nil
            end
          else
            if session[:current_user_id]
              if User.find(session[:current_user_id]).role === "admin"
                return User.find(session[:current_user_id])
              else
                return nil
              end
            else
              return nil
            end
          end
        end

    # in admin/base_controller.rb
    def current_ability
      @current_ability ||= Ability.new(current_user)
    end

    protected

    def default_json
      request.format = :json if params[:format].nil?
    end
  end
end