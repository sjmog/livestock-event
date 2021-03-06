class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    puts user.id
    # can :manage, [Article, Testimonial, Contractor, Booking, Stand, User, Order, Supporter]
    can :read, [StaffMember, SiteContent, Article, Contractor, Testimonial, Stand, Supporter, Exhibitor]
    can :fetch, SiteContent
    can :create, User
    can :create, Order
    can :create, Message
    can :create, Booking
    if user.role == "standard"
        can :manage, User, :id => user.id
        can :manage, Order, :user_id => user.id
        can :manage, Booking, :user_id => user.id
        can :manage, Raform
        can :manage, Showform
        can :manage, Hsform
        can :manage, Hazard
        can :read, User, :id => user.id
        can :read, Booking, :user_id => user.id
        can :read, Order, :user_id => user.id
        can :update, Stand
    elsif user.role == "admin"
        can :manage, :all
        can :manage, User
    end
    # Define abilities for the passed in user here. For example:
    #
    #   user ||= User.new # guest user (not logged in)
    #   if user.admin?
    #     can :manage, :all
    #   else
    #     can :read, :all
    #   end
    #
    # The first argument to `can` is the action you are giving the user 
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on. 
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/ryanb/cancan/wiki/Defining-Abilities
  end
end
