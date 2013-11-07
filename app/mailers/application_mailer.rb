class ApplicationMailer < ActionMailer::Base
  	default from: 'welcome@livestockevent.co.uk'
   
	def welcome_email(user)
	  @user = user
	  @url  = 'http://www.livestockevent.co.uk/'
	  mail(to: @user.email, subject: 'Your login details are attached.')
	end

	def booking_email(user)
	  @user = user
	  @url  = 'http://www.livestockevent.co.uk/'
	  mail(to: @user.email, subject: 'You have successfully created a booking.')
	end
end
