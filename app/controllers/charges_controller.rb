class ChargesController < ApplicationController
	def new
	end

	def create
	  # Amount in cents
	  @order = Order.find(params[:order_id])
	  @order.status = 'deposit paid'
	  @user_id = @order.user_id
	  @user = User.find(@user_id)

	  @amount = (@order.amount.to_i * 100)

	  customer = Stripe::Customer.create(
	    :email => @user.email,
	    :card  => params[:stripeToken]
	  )

	  charge = Stripe::Charge.create(
	    :customer    => customer.id,
	    :amount      => @amount,
	    :description => 'Livestock Event 2014 Stand Booking Deposit',
	    :currency    => 'gbp'
	  )

	rescue Stripe::CardError => e
	  flash[:error] = e.message
	  redirect_to charges_path
	end
end
