source 'https://rubygems.org'

gem 'rails', '4.0.0'
gem 'rails-api'
gem 'bcrypt-ruby', '~> 3.0.0'
gem 'active_model_serializers'
# gem 'rails', '~> 3.2'
gem 'pg',    '~> 0.14'
# gem 'sqlite3'
gem 'filepicker-rails'
gem 'devise'                # server-side authentication
# gem 'bcrypt-ruby'              # password encryption
gem "cancan"      #permissions
gem "rolify"     #roles
gem 'sage_pay'
gem 'stripe', :git => 'https://github.com/stripe/stripe-ruby' #stripe integration
gem 'activemerchant' #decent payment provider integration
# gem 'protected_attributes' #make older devise work with new Rails, avoiding strong param requirements
gem 'encryptor' #better encryption wrapper for OpenSSL
gem 'figaro' #easy environment-specific variables
gem 'simple_form' #super-simple form scaffolding
gem 'formtastic' #slightly more powerful (and namespaced) rails forms
gem 'local_time' #37Signals being wicked awesome and making a local time formatter
gem 'analytics-ruby', :git => 'https://github.com/segmentio/analytics-ruby' #sexy analytics through segment.io
gem 'prawn_rails' #PDF generation
gem 'sunspot_rails' #powerful search & indexing...
gem 'sunspot_solr' #...using Apache's Solr search API
gem 'whenever' # Easy CRON jobs
gem 'public_activity' #activity tracking for models
gem 'watir' #proper headless browsing for data scraping
gem 'nested_form' #better nested record creation and destroying

group :production do
	gem 'heroku-deflater', :group => :production #gzips files
	gem 'uglifier' #mashes everything up so it's nice and small
end

group :assets do
  gem 'jquery-rails'
  gem 'sass-rails'
  gem 'coffee-rails'
  gem 'uglifier'
  gem 'yui-compressor'
end

group :development, :test do
  gem 'database_cleaner'            # cleanup database in tests
  gem 'fabrication'                 # model stubber

  gem 'rb-inotify', require: false  # Linux file notification
  gem 'rb-fsevent', require: false  # OSX file notification
  gem 'rb-fchange', require: false  # Windows file notification
end

gem 'fastercsv' # Only required on Ruby 1.8 and below
gem 'rails_admin' #admin dashboard and panels


gem 'inherited_resources'      # for easy RESTful API controller scaffolding
gem 'active_model_serializers' # works out of the box with ember-data

gem 'ember-rails'              # ember framework
gem 'ember-auth-rails'         # client-side authentication
gem 'emblem-rails'             # easier to write templates

gem 'ember-source', '>= 1.0.0.rc6.2'

gem 'seed_dump' # dump parts of the DB to seeds via Rake

gem 'koala' #nice Facebook API, https://github.com/arsduo/koala/wiki
gem 'twitter', '>= 5.0.0.rc.1' #nice Twitter API, http://rdoc.info/gems/twitter
gem 'linkedin' #nice LinkedIn API, https://github.com/hexgnu/linkedin

gem 'unicorn'                  # better server gem for heroku
gem 'rack-cors', :require => 'rack/cors' #CORS
gem 'newrelic_rpm'             # prevent heroku from idling
gem 'rails_12factor' #static asset serving from heroku
