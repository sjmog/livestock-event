ActionMailer::Base.smtp_settings = {
	:address => "smtp.gmail.com",
	:port => 587,
	:domain => "gmail.com",
	:user_name => "sam@ghostds.com",
	:password => "ace55chopper",
	:authentication => "plain",
	:enable_starttls_auto => true
}