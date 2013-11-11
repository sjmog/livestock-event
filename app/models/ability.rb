class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    # can :manage, [Article, Testimonial, Contractor, Booking, Stand, User, Order, Supporter]
    can :read, [Article, Contractor, Testimonial, Stand, Supporter]
    can :create, User
    can :create, Order
    can :create, Message
    can :manage, User, :id => user.id if user.role == "standard"
    can :manage, Order, :user_id => user.id if user.role == "standard"
    can :update, Order, :user_id => user.id if user.role == "standard"
    can :update, Stand if user.role == "standard"
    can :create, Booking if user.role == "standard"
    can :read, Booking, :user_id => user.id if user.role="standard"
    can :read, Booking if user.role == "admin"
    can :read, User
    can :read, Order if user.role == "admin"
    can :manage, Booking, :user_id => user.id if user.role == "standard"
    can :manage, Article if user.role == "admin"
    can :manage, Testimonial if user.role == "admin"
    can :manage, Contractor if user.role == "admin"
    can :manage, Booking if user.role == "admin"
    can :manage, Order if user.role == "admin"
    can :manage, Stand if user.role == "admin"
    can :manage, Supporter if user.role == "admin"
    can :create, Supporter if user.role == "admin"
    can :manage, User if user.role == "admin"
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
