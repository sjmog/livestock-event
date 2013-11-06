class ContactMailer< ActionMailer::Base
 
  default :from => "noreply@livestockevent.co.uk"
  default :to => "livestockevent@rabdf.co.uk"
 
  def new_message(message)
    @message = message
    mail(:subject => "Website enquiry from #{message.name}")
  end
 
end