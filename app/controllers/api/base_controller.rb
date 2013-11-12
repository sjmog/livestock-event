module Api
  class BaseController < InheritedResources::Base
    respond_to :json
    include CanCan::ControllerAdditions
    
    before_filter do
      :default_json
      resource = controller_name.singularize.to_sym
      method = "#{resource}_params"
      params[resource] &&= send(method) if respond_to?(method, true)
    end

    def collection
      get_collection_ivar || begin
        c = end_of_association_chain
        coll = c.respond_to?(:scoped) ? c.scoped : c
        coll = params[:ids] ? coll.find(params[:ids]) : coll.all
        set_collection_ivar(coll)
      end
    end

    # Returns the active user associated with the access token if available
    def current_user
      api_key = ApiKey.active.where(access_token: token).first
      if api_key
        puts api_key.user.id
        return api_key.user
      else
        return nil
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