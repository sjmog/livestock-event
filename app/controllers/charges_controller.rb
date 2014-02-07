class ChargesController < ApplicationController
	def new
	end

	def create
	  # Amount in cents
	  @order = Order.find(params[:order_id])
	  @order.status = 'deposit paid'
	  @order.save

	  @user_id = @order.user_id
	  booking_id = @order.booking_id

	  @booking = Booking.find(booking_id)
	  @user = User.find(@user_id)

	  @booking.order_id = @order.id
	  @booking.deposit_paid = true
	  @booking.save

	  @amount = (@order.amount.to_i * 100)

		  begin
		  # Use Stripe's bindings to make the charge, rescuing if things go wrong

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
		  # Since it's a decline, Stripe::CardError will be caught
		  flash[:error] = e.message
		  redirect_to charges_path
		rescue Stripe::InvalidRequestError => e
		  # Invalid parameters were supplied to Stripe's API
		  flash[:error] = e.message
		  redirect_to charges_path
		rescue Stripe::AuthenticationError => e
		  # Authentication with Stripe's API failed
		  flash[:error] = e.message
		  redirect_to charges_path
		  # (maybe you changed API keys recently)
		rescue Stripe::APIConnectionError => e
		  # Network communication with Stripe failed
		  flash[:error] = e.message
		  redirect_to charges_path
		rescue Stripe::StripeError => e
		  # Display a very generic error to the user, and maybe send
		  # yourself an email
		  flash[:error] = e.message
		  # Tell the UserMailer to send a welcome Email after save
		  ApplicationMailer.error_email(e).deliver
		  redirect_to charges_path
		rescue => e
		  # Something else happened, completely unrelated to Stripe
		  flash[:error] = e.message
		  redirect_to charges_path
		end
	
	end

end
