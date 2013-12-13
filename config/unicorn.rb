require 'analytics-ruby'

worker_processes 3 # get more out of your free heroku hours
timeout 30
preload_app true

before_fork do |server, worker|
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.connection.disconnect!
    Rails.logger.info 'Disconnected from ActiveRecord'
  end

  sleep 1
end

after_fork do |server, worker|
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.establish_connection
    Rails.logger.info 'Connected to ActiveRecord'
  end
  if defined? AnalyticsRuby
      Analytics = AnalyticsRuby     # Alias for convenience
      Analytics.init({
        secret: 'fzh29q1o5z',        # The write key for sam14/livestockevent
        on_error: Proc.new { |status, msg| print msg }  # Optional error handler
      })
    end
end
