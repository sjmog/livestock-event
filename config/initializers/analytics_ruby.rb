
Analytics = AnalyticsRuby       # Alias for convenience
Analytics.init({
    secret: 'fzh29q1o5z',          # The write key for sam14/livestockevent
    on_error: Proc.new { |status, msg| print msg }  # Optional error handler
})