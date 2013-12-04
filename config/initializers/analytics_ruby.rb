Analytics = AnalyticsRuby            # Alias for convenience
Analytics.init({
    secret: 'fo0f3g49cv6j57thmq9s',  # The secret for livestockevent
    on_error: Proc.new { |status, msg| print msg }  # Optional error handler
})