class ApplicationMailer < ActionMailer::Base
  	default from: 'welcome@livestockevent.co.uk'
   
	def welcome_email(user)
	  @user = user
	  @url  = '<%= ENV["BASE_URL"] %>/'
	  mail(to: @user.email, subject: 'Your login details are attached.')
	end

	def booking_email(user)
	  @user = user
	  @url  = '<%= ENV["BASE_URL"] %>/'
	  mail(to: @user.email, subject: 'You have successfully created a booking.')
	end

	def error_email(e)
		@e = e
		mail(to: 's_morgan@me.com', subject: 'Unexpected Stripe Error: Livestock Event.')
	end
end
