class ContactMailer< ActionMailer::Base
 
  default :from => "thankyou@livestockevent.co.uk"
  default :to => "office@rabdf.co.uk"
 
  def new_message(message)
    @message = message
    mail(:subject => "Website enquiry from #{message.name}")
  end
 
end